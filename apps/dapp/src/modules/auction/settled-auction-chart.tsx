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
import type { Auction, EMPAuctionData } from "@repo/types";
import { useAuction } from "modules/auction/hooks/use-auction";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { abbreviateNumber } from "utils/currency";
import { formatDate } from "utils/date";
import { useGetToggledUsdAmount } from "./hooks/use-get-toggled-usd-amount";
import { SettledAuctionChartOverlay } from "./settled-auction-chart-overlay";

//TODO: revisit this type, see if can be squashed into Bid
export type ParsedBid = {
  id: string;
  bidder: string;
  price: number;
  amountIn: number;
  amountOut: number;
  settledAmountOut: number;
  cumulativeAmountIn: number;
  timestamp: number;
};

type SettleData = {
  marginalPrice?: number;
  minimumPrice?: number;
  sizeRange?: [number, number];
  data?: ParsedBid[];
};

const useChartData = (
  auction: Auction | undefined,
  auctionData: EMPAuctionData | undefined,
): SettleData => {
  // Validate
  if (!auctionData || !auction) return {};

  // Create data array and parse inputs
  const data = auction.bids
    .filter((b) => b.status !== "refunded")
    .map((bid) => {
      const amountIn = Number(bid.amountIn);
      const amountOut = isFinite(Number(bid.amountOut))
        ? Number(bid.amountOut)
        : 0;

      const price = Number(bid.submittedPrice);
      const timestamp = Number(bid.blockTimestamp) * 1000;

      return {
        id: bid.id,
        bidder: bid.bidder,
        price,
        amountIn,
        amountOut,
        settledAmountOut: Number(bid.settledAmountOut),
        cumulativeAmountIn: 0,
        timestamp,
      };
    });

  if (!data) return {};

  data.sort((a, b) => b.price - a.price);

  // Track cumulative tokens sold
  let cumulativeAmountIn = 0;
  data.forEach((bid) => {
    cumulativeAmountIn += bid.amountIn;
    bid.cumulativeAmountIn = cumulativeAmountIn;
  });

  // Insert initial data point for drawing first token sale left line
  data.unshift({ cumulativeAmountIn: Number(0), price: data[0].price });

  // Insert final data point for drawing last token sale right line
  data.push({
    cumulativeAmountIn: data[data.length - 1].cumulativeAmountIn,
    price: Number(0),
  });

  // const prices = getAuctionPrices(data, auction, auctionData);
  return { data };
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
  const { getToggledUsdAmount } = useGetToggledUsdAmount(
    props.auction?.quoteToken,
  );
  const { timestamp, price, amountIn, settledAmountOut } =
    props?.payload[0]?.payload || {};

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
  lotId?: string;
  chainId?: number;
};

export const SettledAuctionChart = ({
  lotId,
  chainId,
}: SettledAuctionChartProps) => {
  const { result: auction } = useAuction(lotId, chainId);
  const { data: auctionData } = useAuctionData({ lotId, chainId });
  const { getToggledUsdAmount } = useGetToggledUsdAmount(auction?.quoteToken);

  const { data } = useChartData(auction, auctionData as EMPAuctionData);

  const marginalPrice = Number(auction?.formatted?.marginalPrice);
  const capacityFilled = Number(auction?.capacityInitial) * marginalPrice;

  return (
    <div
      className="size-full"
      style={{ position: "relative", paddingRight: 16, height: 488 }}
    >
      {auction && <SettledAuctionChartOverlay auction={auction} />}

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data}>
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
              return abbreviateNumber(value, 1000);
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
            strokeDasharray="3 3"
          />
          <Area
            type="stepBefore"
            dataKey="price"
            stroke="#75C8F6"
            dot={false}
            strokeWidth={2}
          />
          {data?.map((entry, index) => (
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
          <ReferenceLine
            segment={[
              { x: 0, y: 0 },
              { x: data ? data[data.length - 1].cumulativeAmountIn : 0, y: 0 },
            ]}
            stroke="#75C8F6"
            strokeWidth={2}
          />
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
            content={
              (props) => {
                return <CustomTooltip {...props} auction={auction} />;
              }
              // return <CustomTooltip payload={payload} auction={auction} />}
            }
          />
          <Legend align="left" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
