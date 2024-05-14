import {
  GetAtomicAuctionLotQuery,
  GetBatchAuctionLotQuery,
} from "@repo/subgraph-client/src/generated";

export type AtomicSubgraphAuction = NonNullable<
  GetAtomicAuctionLotQuery["atomicAuctionLot"]
>;

export type BatchSubgraphAuction = NonNullable<
  GetBatchAuctionLotQuery["batchAuctionLot"]
>;

export type SubgraphAuction = AtomicSubgraphAuction | BatchSubgraphAuction;

export type BatchAuctionBid = BatchSubgraphAuction["bids"][0];

export type AuctionDecryptedBid = BatchSubgraphAuction["bidsDecrypted"][0];

export type AuctionRefundedBid = BatchSubgraphAuction["bidsRefunded"][0];

export type AuctionPurchase = AtomicSubgraphAuction["purchases"][0];
