import type { CartesianViewBox } from "recharts/types/util/types";
import type { ScatterPointItem } from "recharts/types/cartesian/Scatter";
import type { Auction, AuctionData } from "src/types";
import {
  LabelProps,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { format } from "date-fns";
import { CircleIcon, GemIcon, XIcon } from "lucide-react";
import { cn } from "@repo/ui";
import { useAuction } from "loaders/useAuction";
import { formatDate } from "src/utils/date";
import { SVGProps } from "react";
import { getAuctionPrices } from "modules/auction/utils/get-auction-prices";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";

//TODO: revisit this type, see if can be squashed into Bid
export type ParsedBid = {
  id: string;
  bidder: string;
  price: number;
  amountIn: number;
  amountOut: number;
  timestamp: number;
};

type SettleData = {
  marginalPrice?: number;
  minimumPrice?: number;
  data?: ParsedBid[];
};

const useChartData = (
  auction: Auction | undefined,
  auctionData: AuctionData | undefined,
): SettleData => {
  // Validate
  if (!auctionData) return {};

  // 1. Create data array and parse inputs
  const data = !auction
    ? undefined
    : auction.bids.map((bid) => {
        const amountIn = Number(bid.amountIn);
        const amountOut = isFinite(Number(bid.amountOut))
          ? Number(bid.amountOut)
          : 0;

        const price = amountIn / amountOut;
        const timestamp = Number(bid.blockTimestamp) * 1000;

        return {
          id: bid.id,
          bidder: bid.bidder,
          price,
          amountIn,
          amountOut,
          timestamp,
        };
      });

  if (!auction || !data) return {};

  data.sort((a, b) => a.price - b.price);

  const prices = getAuctionPrices(data, auction, auctionData);

  return { data, ...prices };
};

type SettledAuctionChartProps = {
  lotId?: string;
};

const timestampFormatter = (timestamp: number) => {
  return format(new Date(timestamp), "MM-dd HH:mm");
};

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

export const SettledAuctionChart = ({ lotId }: SettledAuctionChartProps) => {
  const { result: auction } = useAuction(lotId);
  const { data: auctionData } = useAuctionData(auction);

  const start = Number(auction?.start) * 1000;
  const conclusion = Number(auction?.conclusion) * 1000;

  const {
    data: chartData,
    marginalPrice,
    minimumPrice,
  } = useChartData(auction, auctionData);

  const sizeRange = [
    !chartData
      ? 0
      : chartData.reduce(
          (min, p) => (p.amountIn < min ? p.amountIn : min),
          chartData[0].amountIn,
        ),
    !chartData
      ? 0
      : chartData.reduce(
          (max, p) => (p.amountIn > max ? p.amountIn : max),
          chartData[0].amountIn,
        ),
  ];

  // Scale the size range values to have a maximum of 500
  sizeRange[0] = (sizeRange[0] / sizeRange[1]) * 500;
  sizeRange[1] = 500;

  return (
    <div className="size-full max-h-[260px]">
      <ResponsiveContainer minWidth={300} minHeight={260}>
        <ScatterChart>
          <XAxis
            className="text-xs"
            type="number"
            tickLine={false}
            minTickGap={30}
            dataKey="timestamp"
            domain={[start, conclusion]}
            name="timestamp"
            stroke="#f4f4f4"
            tickFormatter={timestampFormatter}
          />
          <YAxis
            className="text-xs"
            type="number"
            tickLine={false}
            dataKey="price"
            name="price"
            minTickGap={40}
            stroke="#f4f4f4"
            domain={[
              0,
              !marginalPrice && minimumPrice ? minimumPrice * 1.5 : "dataMax", // If there is no marginal price, use the minimum price as every bid will have a price below that
            ]}
            tickFormatter={(value) => value + " " + auction?.quoteToken.symbol}
          />
          <ZAxis
            type="number"
            dataKey="amountIn"
            name="amountIn"
            range={sizeRange}
          />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            // @ts-expect-error TODO fix typing
            formatter={formatter}
            wrapperStyle={{ backgroundColor: "transparent", outline: "none" }}
            content={(props) => <CustomTooltip {...props} auction={auction} />}
          />
          <Scatter
            name="bids"
            data={chartData}
            shape={(props: Omit<CustomShapeProps, "marginalPrice">) => (
              <CustomShape {...props} marginalPrice={marginalPrice} />
            )}
          />
          <ReferenceLine
            y={marginalPrice ?? undefined} // Only display the settled/marginal price if it is non-zero
            stroke="#76BDF2"
            className="relative *:absolute *:top-10"
            label={(props: Omit<LabelProps, "content">) => (
              <CustomLabel
                {...props}
                label="Settled Price"
                className="fill-axis-teal"
              />
            )}
          />
          <ReferenceLine
            y={minimumPrice}
            strokeDasharray="3 3"
            stroke="orange"
            label={(props) => (
              <CustomLabel
                {...props}
                content="Minimum Price"
                className="fill-axis-orange"
              />
            )}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

function CustomLabel(
  props: LabelProps & { viewBox?: CartesianViewBox; label: string },
) {
  return (
    <text
      {...props?.viewBox}
      y={Number(props.viewBox?.y ?? 0) - Number(props?.offset)}
      x={props.viewBox?.x}
      className={cn("absolute text-xs font-semibold", props.className)}
    >
      {props.label}
    </text>
  );
}

type CustomShapeProps = ScatterPointItem &
  SVGProps<SVGElement> & {
    marginalPrice?: number;
  };

function CustomShape({
  marginalPrice = 0,
  ...props
}: React.PropsWithoutRef<CustomShapeProps>) {
  return (
    <>
      <CircleIcon className="fill-transparent text-transparent" {...props} />
      {marginalPrice <= props.payload.price ? (
        <GemIcon className="text-axis-green" {...props} />
      ) : (
        <XIcon className="text-axis-red *:p-4" {...props} />
      )}
    </>
  );
}

type SettledTooltipProps = {
  auction?: Auction;
} & TooltipProps<number, "timestamp" | "price" | "amountIn">;

function CustomTooltip(props: SettledTooltipProps) {
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
}
