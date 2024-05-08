// import { format } fr11om "date-fns";
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
} from "recharts";
import type { Auction, EMPAuctionData } from "@repo/types";
import { useAuction } from "modules/auction/hooks/use-auction";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { abbreviateNumber } from "utils/currency";
import { formatDate } from "utils/date";
import { useGetUsdValue } from "./hooks/use-get-usd-value";
import { useToggle } from "@repo/ui";
import { formatUsdValue } from "./utils/format-usd-value";

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

// type FormatterProps = {
//   dataKey: string;
//   name: "timestamp" | "price" | "amountIn";
//   value: number;
// };

// const formatter = (value: unknown, _name: string, props: FormatterProps) => {
//   if (props.dataKey === "timestamp" && typeof value == "number") {
//     return format(new Date(value), "yyyy-MM-dd HH:mm:ss");
//   }

//   return value;
// };

const CustomTooltip = (props: SettledTooltipProps) => {
  // console.log("props", props.payload)
  const [timestamp, price, amountIn] = props.payload ?? [];
  const auction = props.auction;

  return (
    <div className="bg-secondary rounded-sm px-4 py-2">
      <div>
        Amount In: {amountIn?.value} {auction?.quoteToken.symbol}
      </div>
      <div>
        Price: {price?.value} {auction?.quoteToken.symbol}
      </div>
      <div>At {formatDate.fullLocal(new Date(timestamp?.value ?? 0))}</div>
    </div>
  );
};

type SettledAuctionChartProps = {
  lotId?: string;
  chainId?: number;
  overlay?: () => React.ReactNode;
};

export const SettledAuctionChart = ({
  lotId,
  chainId,
  overlay,
}: SettledAuctionChartProps) => {
  const { result: auction } = useAuction(lotId, chainId);
  const { data: auctionData } = useAuctionData({ lotId, chainId });
  const { getUsdValue } = useGetUsdValue(auction?.quoteToken); // TODO race condition?
  const { isToggled: isUsdToggled } = useToggle();

  const { data } = useChartData(auction, auctionData as EMPAuctionData);

  const marginalPrice = Number(auction?.formatted?.marginalPrice);
  const capacityFilled = Number(auction?.capacityInitial) * marginalPrice;

  return (
    <div
      className="size-full"
      style={{ position: "relative", paddingRight: 16, height: 488 }}
    >
      {overlay && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 1,
          }}
        >
          {overlay()}
        </div>
      )}

      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          // margin={{ top: 44, right: 16, left: 16, bottom: 16 }}
        >
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
            tickFormatter={(value) => {
              return isUsdToggled ? formatUsdValue(getUsdValue(value)) : value;
            }}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            // @ts-expect-error TODO
            // formatter={formatter}
            wrapperStyle={{ backgroundColor: "transparent", outline: "none" }}
            content={(props) => <CustomTooltip {...props} auction={auction} />}
          />
          <Legend align="left" />
          <ReferenceLine
            x={capacityFilled}
            stroke="#D7D7C1"
            strokeDasharray="3 3"
            label={{
              fontSize: 14,
              fill: "#D7D7C1",
              value: "Capacity filled",
              position: "top",
              angle: -90,
              offset: -180,
              dx: -6,
            }}
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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};
