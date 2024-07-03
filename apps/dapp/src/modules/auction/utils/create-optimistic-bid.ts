import { formatUnits } from "viem";
import type { Address, BatchAuctionBid } from "@repo/types";
import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client/src/generated";

const getNextBidId = (auctionQueryResult: GetBatchAuctionLotQuery) => {
  return (
    auctionQueryResult.batchAuctionLot?.bids?.reduce(
      (maxId, bid) => Math.max(maxId, Number(bid.bidId)),
      0,
    ) || 1
  );
};

/**
 * Creates a fake bid entry on an auction
 * Used after the bid transaction succeeds to mitigate subgraph update delays
 */
const createOptimisticBid = (
  auctionQueryResult: GetBatchAuctionLotQuery,
  bidder: Address,
  amountIn: bigint,
  amountOut: bigint,
): BatchAuctionBid => {
  const auction = auctionQueryResult.batchAuctionLot!;
  const nextBidId = getNextBidId(auctionQueryResult).toString();
  const quoteTokenDecimals = Number(auction.quoteToken.decimals);
  const amountInDecimal = Number(formatUnits(amountIn, quoteTokenDecimals));
  const amountOutDecimal = Number(
    formatUnits(amountOut, Number(auction.baseToken.decimals)),
  );
  const submittedPrice = (amountInDecimal / amountOutDecimal).toString();

  return {
    bidId: nextBidId,
    bidder,
    blockTimestamp: Math.floor(Date.now() / 1000).toString(),
    date: new Date().toISOString(),
    amountIn: formatUnits(amountIn, quoteTokenDecimals),
    rawAmountIn: amountIn.toString(),
    rawAmountOut: amountOut.toString(),
    rawMarginalPrice: null,
    rawSubmittedPrice: null,
    submittedPrice,
    settledAmountIn: null,
    settledAmountInRefunded: null,
    settledAmountOut: null,
    status: "submitted",
    outcome: null,
    referrer: null,
    claimed: null,
  };
};

export { createOptimisticBid };
