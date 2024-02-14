import {
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
} from "recharts";
import { SubgraphAuctionWithEvents } from "loaders/subgraphTypes";
import { useAuction } from "loaders/useAuction";
import { formatUnits } from "viem";
import { useReadContract } from "wagmi";
import { axisContracts } from "@repo/contracts";

const useChartData = (auction: SubgraphAuctionWithEvents | undefined) => {
  // Goal: Array of data with the following data per object:
  // - bid ID
  // - bidder
  // - price
  // - amountIn
  // - amountOut
  // - timestamp
  // - marginalPrice
  if (!auction) return [];

  // 1. Create data array and parse inputs
  const data = auction.bidsDecrypted.map((bid) => {
    const amountIn = Number(
      formatUnits(BigInt(bid.amountIn), Number(auction.baseToken.decimals)),
    );
    const amountOut = Number(
      formatUnits(BigInt(bid.amountOut), Number(auction.quoteToken.decimals)),
    );
    const price = amountIn / amountOut;
    const timestamp = Number(bid.blockTimestamp) * 1000;

    return {
      id: bid.id,
      bidder: bid.bid.bidder,
      price,
      amountIn,
      amountOut,
      timestamp,
    };
  });

  // 2. Sort bids by price
  data.sort((a, b) => a.price - b.price);

  // 3. Calculate the marginal price
  // Load data from auction module for lot
  /* eslint-disable-next-line */
  const lsbbaData = useReadContract({
    abi: axisContracts.abis.localSealedBidBatchAuction,
    address:
      axisContracts.addresses[auction.chainId].localSealedBidBatchAuction,
    functionName: "auctionData",
  });
  if (!lsbbaData.data) return [];
  const minimumPrice = Number(
    formatUnits(lsbbaData.data[3], Number(auction.quoteToken.decimals)),
  );
  const minimumFill = Number(
    formatUnits(lsbbaData.data[4], Number(auction.baseToken.decimals)),
  );

  // Apply marginal price algorithm
  const capacity = Number(
    formatUnits(BigInt(auction.capacity), Number(auction.baseToken.decimals)),
  );
  let marginalPrice = 0;
  let totalAmountIn = 0;
  let capacityExpended = 0;
  let lastPrice = 0;
  for (let i = 0; i < data.length; i++) {
    const bid = data[i];

    if (bid.price < minimumPrice) {
      marginalPrice = lastPrice;
      break;
    }

    lastPrice = bid.price;
    totalAmountIn += bid.amountIn;
    capacityExpended = totalAmountIn * bid.price;

    if (capacityExpended >= capacity) {
      marginalPrice = bid.price;
      break;
    }

    if (i == data.length - 1) {
      marginalPrice = bid.price;
    }
  }

  if (capacityExpended < minimumFill) {
    marginalPrice = 0;
  }

  // Add marginal price to each bid and return
  return data.map((bid) => {
    return {
      ...bid,
      marginalPrice,
    };
  });
};

export const SettledAuctionChart = (lotId?: string) => {
  const { result: auction } = useAuction(lotId);

  const chartData = useChartData(auction);

  return (
    <ResponsiveContainer minWidth={300} minHeight={260}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="timestamp" name="Bid Submitted" />
        <YAxis type="number" dataKey="price" name="Bid Price" />
        <Scatter name="Bids" data={chartData} />
        <Line dot={false} type="monotone" dataKey="marginalPrice" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
