import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client";

export type BatchSubgraphAuction = NonNullable<
  GetBatchAuctionLotQuery["batchAuctionLot"]
>;

export type NonNullSubgraphAuction = BatchSubgraphAuction;

// Allows subgraph responses to be tagged with an optional timestamp for delaying refetching
export type MaybeOptimistic = { _lastOptimisticUpdateTimestamp?: number };

export type BatchAuctionBid = BatchSubgraphAuction["bids"][0];

export type AuctionDecryptedBid = BatchSubgraphAuction["bidsDecrypted"][0];

export type AuctionRefundedBid = BatchSubgraphAuction["bidsRefunded"][0];
