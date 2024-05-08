import type { CartesianViewBox } from "recharts/types/util/types";
import type { ScatterPointItem } from "recharts/types/cartesian/Scatter";
import type { Auction, BatchAuction, EMPAuctionData } from "@repo/types";
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
import { formatDate } from "src/utils/date";
import { SVGProps } from "react";
import { getAuctionPrices } from "modules/auction/utils/get-auction-prices";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { trimCurrency } from "utils/currency";
import { formatUnits } from "viem";

//TODO: revisit this type, see if can be squashed into Bid
export type ParsedBid = {
  id: string;
  bidder: string;
  price: number;
  amountIn: number;
  amountOut: number;
  settledAmountOut: number;
  timestamp: number;
};

type SettleData = {
  marginalPrice?: number;
  minimumPrice?: number;
  sizeRange?: [number, number];
  data?: ParsedBid[];
};

const useChartData = (
  auction: BatchAuction | undefined,
  auctionData: EMPAuctionData | undefined,
): SettleData => {
  // Validate
  if (!auctionData) return {};

  // 1. Create data array and parse inputs
  const data = !auction
    ? undefined
    : auction.bids
        .filter((b) => b.status !== "refunded")
        .map((bid) => {
          const amountIn = Number(
            formatUnits(BigInt(bid.rawAmountIn), auction.quoteToken.decimals),
          );
          const amountOut = isFinite(Number(bid.rawAmountOut))
            ? Number(
                formatUnits(
                  BigInt(bid.rawAmountOut ?? 0),
                  auction.baseToken.decimals,
                ),
              )
            : 0;

          const price = Number(bid.submittedPrice);
          const timestamp = Number(bid.blockTimestamp) * 1000;

          return {
            id: bid.bidId,
            bidder: bid.bidder,
            price,
            amountIn,
            amountOut,
            settledAmountOut: Number(bid.settledAmountOut),
            timestamp,
          };
        });

  if (!auction || !data) return {};

  data.sort((a, b) => a.price - b.price);

  const sizeRange: [number, number] = [
    !data
      ? 0
      : data.reduce(
          (min, p) => (p.amountIn < min ? p.amountIn : min),
          data[0].amountIn,
        ),
    !data
      ? 0
      : data.reduce(
          (max, p) => (p.amountIn > max ? p.amountIn : max),
          data[0].amountIn,
        ),
  ];
  // Scale the size range values to have a maximum of 500
  sizeRange[0] = (sizeRange[0] / sizeRange[1]) * 500;
  sizeRange[1] = 500;

  const prices = getAuctionPrices(data, auction, auctionData);
  return { data, sizeRange, ...prices };
};

// type SettledAuctionChartProps = {
//   lotId?: string;
//   chainId?: number;
// };

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

export const SettledAuctionChart = ({ auction }: { auction: BatchAuction }) => {
  const { data: auctionData } = useAuctionData(auction);

  const start = Number(auction?.start) * 1000;
  const conclusion = Number(auction?.conclusion) * 1000;

  const { data, sizeRange } = useChartData(
    auction,
    auctionData as EMPAuctionData,
  );

  const marginalPrice = Number(auction?.formatted?.marginalPrice);
  const minimumPrice = Number(auction?.formatted?.minPrice);

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
            domain={([min, max]) => [
              Math.min(minimumPrice ?? 0, min) * 0.5,
              !marginalPrice && minimumPrice ? minimumPrice * 1.5 : max * 1.1, // If there is no marginal price, use the minimum price as every bid will have a price below that
            ]}
            tickFormatter={(value) =>
              trimCurrency(value) + " " + auction?.quoteToken.symbol
            }
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
            data={data}
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

function CustomShape(props: React.PropsWithoutRef<CustomShapeProps>) {
  return (
    <>
      <CircleIcon className="fill-transparent text-transparent" {...props} />
      {props.payload.settledAmountOut ? (
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
