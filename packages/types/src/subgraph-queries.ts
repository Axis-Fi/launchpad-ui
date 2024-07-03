import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client/src/generated";

export type BatchSubgraphAuction = NonNullable<
  GetBatchAuctionLotQuery["batchAuctionLot"]
>;

export type AuctionsLot = GetBatchAuctionLotQuery["batchAuctionLot"];

export type SubgraphAuction = BatchSubgraphAuction;

// Allows subgraph responses to be tagged with an optional timestamp for delaying refetching
export type MaybeFresh = { _lastOptimisticUpdateTimestamp?: number };

export type AuctionsQuery = GetBatchAuctionLotQuery["batchAuctionLot"] &
  MaybeFresh;

export type BatchAuctionBid = BatchSubgraphAuction["bids"][0];

export type AuctionDecryptedBid = BatchSubgraphAuction["bidsDecrypted"][0];

export type AuctionRefundedBid = BatchSubgraphAuction["bidsRefunded"][0];
