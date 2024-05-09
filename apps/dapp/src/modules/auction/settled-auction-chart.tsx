import { format } from "date-fns";
import { OriginIcon } from "./origin-icon";
import {
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Area,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
  ReferenceDot,
} from "recharts";
import type { Auction, BatchAuction, EMPAuctionData } from "@repo/types";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { abbreviateNumber } from "utils/currency";
import { formatDate, getTimestamp } from "utils/date";
import { useGetToggledUsdAmount } from "./hooks/use-get-toggled-usd-amount";
import { SettledAuctionChartOverlay } from "./settled-auction-chart-overlay";

//TODO: revisit this type, see if can be squashed into Bid
export type ParsedBid = {
  id: string;
  bidder: string;
  price: number;
  amountIn: number;
  amountOut: number;
  settledAmountIn: number;
  settledAmountOut: number;
  cumulativeAmountIn: number;
  timestamp: number;
  outcome: string;
};

type SettleData = {
  marginalPrice?: number;
  minimumPrice?: number;
  sizeRange?: [number, number];
  bids?: ParsedBid[];
};

const useChartData = (
  auction: BatchAuction | undefined,
  auctionData: EMPAuctionData | undefined,
): SettleData => {
  // Validate
  if (!auctionData || !auction) return {};

  // Create data array and parse inputs
  const filledBids = auction.bids
    .filter((b) => b.status !== "refunded")
    .map((bid) => {
      const price = Number(bid.submittedPrice);
      const timestamp = Number(bid.blockTimestamp) * 1000;

      return {
        id: bid.bidId,
        bidder: bid.bidder,
        price,
        amountIn: Number(bid.amountIn),
        amountOut: Number(bid.amountOut),
        settledAmountIn: Number(bid.settledAmountIn),
        settledAmountOut: Number(bid.settledAmountOut),
        cumulativeAmountIn: 0,
        timestamp,
        outcome: bid.outcome,
      };
    });
  if (!filledBids) return {};

  filledBids.sort((a, b) => b.price - a.price);

  // Track cumulative bid amounts
  let cumulativeAmountIn = 0;
  filledBids.forEach((bid) => {
    cumulativeAmountIn += bid.amountIn;
    bid.cumulativeAmountIn = cumulativeAmountIn;
  });

  // Insert initial data point for drawing first bid left line
  filledBids.unshift({
    cumulativeAmountIn: Number(0),
    price: filledBids[0].price,
  });

  // Insert final data point for drawing last bid right line
  filledBids.push({
    cumulativeAmountIn: filledBids[filledBids.length - 1].cumulativeAmountIn,
    price: Number(0),
  });

  return { bids: filledBids };
};

type SettledTooltipProps = {
  auction?: Auction;
} & TooltipProps<number, "timestamp" | "price" | "amountIn">;

type FormatterProps = {
  dataKey: string;
  name: "timestamp" | "price" | "amountIn";
  value: number;
};

const formatter = (value: unknown, _name: string, props: FormatterProps) => {
  if (props.dataKey === "timestamp" && typeof value == "number") {
    return format(new Date(value), "yyyy-MM-dd HH:mm:ss");
  }

  return value;
};

const CustomTooltip = (props: SettledTooltipProps) => {
  const auctionEndTimestamp = props?.auction?.formatted
    ? getTimestamp(props.auction.formatted.endDate)
    : undefined;

  const { getToggledUsdAmount } = useGetToggledUsdAmount(
    props.auction?.quoteToken,
    auctionEndTimestamp,
  );

  const payload = props.payload?.[0]?.payload;

  // Ignore data points used for drawing the start and end lines
  if (
    payload === undefined ||
    payload.price === 0 ||
    payload.cumulativeAmountIn === 0
  ) {
    return null;
  }

  const { timestamp, price, amountIn, settledAmountOut } = payload;

  return (
    <div className="bg-secondary rounded-sm px-4 py-2">
      <div>Amount: {getToggledUsdAmount(amountIn)}</div>
      <div>Price: {getToggledUsdAmount(price)}</div>
      <div>
        Settled: {abbreviateNumber(settledAmountOut)}{" "}
        {props.auction?.baseToken.symbol}
      </div>
      <div>At: {formatDate.fullLocal(new Date(timestamp ?? 0))}</div>
    </div>
  );
};

type SettledAuctionChartProps = {
  auction: BatchAuction;
};

export const SettledAuctionChart = ({ auction }: SettledAuctionChartProps) => {
  const { data: auctionData } = useAuctionData(auction);

  const auctionEndTimestamp = auction?.formatted
    ? getTimestamp(auction.formatted.endDate)
    : undefined;

  const { getToggledUsdAmount } = useGetToggledUsdAmount(
    auction?.quoteToken,
    auctionEndTimestamp,
  );

  const { bids } = useChartData(auction, auctionData as EMPAuctionData);
  const marginalPrice = Number(auction?.formatted?.marginalPrice);
  const capacityFilled = Number(auction?.sold) * marginalPrice;

  // console.log("ASDF2", data, data?.filter((bid) => bid.outcome === "won"))

  console.log({ auction });
  return (
    <div className="size-full" style={{ position: "relative", height: 488 }}>
      {auction && <SettledAuctionChartOverlay auction={auction} />}

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={bids}>
          <CartesianGrid
            stroke="#D7D7C1"
            strokeDasharray="0"
            strokeWidth={0.5}
            vertical={false}
          />
          <XAxis
            dataKey="cumulativeAmountIn"
            type="number"
            tick={{ fill: "#D7D7C1", fontSize: 14 }}
            tickFormatter={(value) => {
              return abbreviateNumber(value, 0);
            }}
          />
          <YAxis
            dataKey="price"
            type="number"
            tick={{ fill: "#D7D7C1", fontSize: 14 }}
            tickFormatter={(value) => getToggledUsdAmount(value, false)}
          />
          <ReferenceLine
            x={capacityFilled}
            stroke="#D7D7C1"
            strokeDasharray="6 6"
          />
          <Area
            // data={filterUnsuccessfulBids(data)}
            type="stepBefore"
            dataKey="price"
            stroke="#75C8F6"
            dot={false}
            strokeWidth={2}
          />
          {bids?.map((entry, index) => (
            <ReferenceLine
              key={index}
              segment={[
                { x: entry.cumulativeAmountIn, y: 0 },
                { x: entry.cumulativeAmountIn, y: entry.price },
              ]}
              stroke="#75C8F6"
              strokeWidth={2}
            />
          ))}
          <ReferenceDot
            x={capacityFilled}
            y={marginalPrice}
            isFront={true}
            shape={(props) => <OriginIcon cx={props.cx} cy={props.cy} />}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            // @ts-expect-error TODO
            formatter={formatter}
            wrapperStyle={{ backgroundColor: "transparent", outline: "none" }}
            content={(props) => {
              return <CustomTooltip {...props} auction={auction} />;
            }}
          />
          <Legend
            align="left"
            payload={[
              {
                value: "Bid price (y) and Amount (x)",
                type: "rect",
                color: "#D7D7C1",
              },
              {
                value: "Capacity filled",
                type: "plainline",
                color: "#D7D7C1",
                payload: { strokeDasharray: "6 6" },
              },
            ]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
