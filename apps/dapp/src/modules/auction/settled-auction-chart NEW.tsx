import type { CartesianViewBox } from "recharts/types/util/types";
import type { ScatterPointItem } from "recharts/types/cartesian/Scatter";
import type { Auction, EMPAuctionData } from "@repo/types";
import {
  LabelProps,
  ReferenceLine,
  LineChart,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
  CartesianGrid,
  Label,
  Line,
} from "recharts";
import { format } from "date-fns";
import { CircleIcon, GemIcon, XIcon } from "lucide-react";
import { cn } from "@repo/ui";
import { useAuction } from "modules/auction/hooks/use-auction";
import { formatDate } from "src/utils/date";
import { SVGProps } from "react";
import { getAuctionPrices } from "modules/auction/utils/get-auction-prices";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { trimCurrency } from "utils/currency";

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
  auction: Auction | undefined,
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

type SettledAuctionChartProps = {
  lotId?: string;
  chainId?: number;
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

export const SettledAuctionChart = ({
  lotId,
  chainId,
}: SettledAuctionChartProps) => {
  const { result: auction } = useAuction(lotId, chainId);
  const { data: auctionData } = useAuctionData({ lotId, chainId });

  const start = Number(auction?.start) * 1000;
  const conclusion = Number(auction?.conclusion) * 1000;

  const { data, sizeRange } = useChartData(
    auction,
    auctionData as EMPAuctionData,
  );

  const marginalPrice = Number(auction?.formatted?.marginalPrice);
  const minimumPrice = Number(auction?.formatted?.minPrice);
  console.log("DDDD", { auction, auctionData, data, sizeRange, marginalPrice, minimumPrice, start, conclusion });

  return (
    <div className="size-full max-h-[260px]">
       <LineChart
      data={data}
      width={600}
      height={300}
      margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="1" vertical={false} />
      <XAxis dataKey="cumulativeSize">
        <Label value="Capacity filled" offset={0} position="insideBottom" />
      </XAxis>
      <YAxis
        dataKey="price"
        type="number"
        label={{
          value: "Price per token",
          angle: -90,
          position: "insideMiddle",
        }}
      />
      <Tooltip />
      <ReferenceLine
        x={111}
        stroke="red"
        strokeDasharray="3 3"
        label={{ value: "Maximum capacity", position: "top" }}
      />
      <ReferenceLine
        y={10}
        label="Final settlement price"
        stroke="green"
      />
      <Line type="stepAfter" dataKey="price" stroke="#8884d8" dot={false} />
    </LineChart>
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
