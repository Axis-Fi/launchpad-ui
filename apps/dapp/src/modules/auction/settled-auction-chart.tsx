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
  Line,
} from "recharts";
import { format } from "date-fns";
import type { Auction, BatchAuction, EMPAuctionData } from "@repo/types";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { abbreviateNumber } from "utils/currency";
import { formatDate, getTimestamp } from "utils/date";
import { useGetToggledUsdAmount } from "./hooks/use-get-toggled-usd-amount";
import { SettledAuctionChartOverlay } from "./settled-auction-chart-overlay";
import {
  BID_OUTCOME,
  type SortedBid,
  useSortedBids,
} from "./hooks/use-sorted-bids";
import { OriginIcon } from "./origin-icon";

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

  // Ignore data points used for drawing the corners of first & last bid
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

const filterWinningBids = (bids: SortedBid[]) => {
  return bids.filter(
    (bid) =>
      bid.outcome === BID_OUTCOME.WON ||
      bid.outcome === BID_OUTCOME.PARTIAL_FILL,
  );
};

export const SettledAuctionChart = ({ auction }: { auction: BatchAuction }) => {
  const { data: auctionData } = useAuctionData(auction);

  const auctionEndTimestamp = auction?.formatted
    ? getTimestamp(auction.formatted.endDate)
    : undefined;

  const { getToggledUsdAmount } = useGetToggledUsdAmount(
    auction?.quoteToken,
    auctionEndTimestamp,
  );

  const bids = useSortedBids(auction, auctionData as EMPAuctionData);
  const marginalPrice = Number(auction?.formatted?.marginalPrice);
  const amountRaised = Number(auction?.sold) * marginalPrice;
  const winning = filterWinningBids(bids);

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
            tickFormatter={(value) => abbreviateNumber(value, 0)}
            tickLine={false}
          />
          <YAxis
            dataKey="price"
            type="number"
            tick={{ fill: "#D7D7C1", fontSize: 14 }}
            tickFormatter={(value) => getToggledUsdAmount(value, false)}
            tickLine={false}
          />
          <ReferenceLine
            x={amountRaised}
            stroke="#D7D7C1"
            strokeDasharray="6 6"
          />
          <Area
            data={winning}
            type="stepBefore"
            dataKey="price"
            stroke="#75C8F6"
            dot={false}
            strokeWidth={2}
          />
          <Line
            data={bids}
            type="stepBefore"
            dataKey="price"
            stroke="#75C8F6"
            dot={false}
            strokeWidth={2}
          />
          {bids?.map(
            (bid, index) =>
              bid.outcome !== BID_OUTCOME.PARTIAL_FILL && (
                <ReferenceLine
                  key={index}
                  segment={[
                    { x: bid.cumulativeAmountIn, y: 0 },
                    { x: bid.cumulativeAmountIn, y: bid.price },
                  ]}
                  stroke="#75C8F6"
                  strokeWidth={2}
                />
              ),
          )}
          <ReferenceDot
            x={amountRaised}
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
                value: "USDB raised",
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
