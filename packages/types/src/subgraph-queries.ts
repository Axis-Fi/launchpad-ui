import { GetBatchAuctionLotQuery } from "@repo/subgraph-client/src/generated";

export type BatchSubgraphAuction = NonNullable<
  GetBatchAuctionLotQuery["batchAuctionLot"]
>;

export type SubgraphAuction = BatchSubgraphAuction;

export type BatchAuctionBid = BatchSubgraphAuction["bids"][0];

export type AuctionDecryptedBid = BatchSubgraphAuction["bidsDecrypted"][0];

export type AuctionRefundedBid = BatchSubgraphAuction["bidsRefunded"][0];
