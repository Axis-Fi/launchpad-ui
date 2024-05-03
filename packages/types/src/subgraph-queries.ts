import {
  GetAtomicAuctionLotQuery,
  GetAuctionLotsQuery,
  GetBatchAuctionLotQuery,
} from "@repo/subgraph-client/src/generated";

export type AtomicBaseSubgraphAuction =
  GetAuctionLotsQuery["atomicAuctionLots"][0];
export type BatchBaseSubgraphAuction =
  GetAuctionLotsQuery["batchAuctionLots"][0];

export type RawSubgraphAuction = AtomicSubgraphAuction | BatchSubgraphAuction;

export type AtomicSubgraphAuction = NonNullable<
  GetAtomicAuctionLotQuery["atomicAuctionLot"]
>;

export type BatchSubgraphAuction = NonNullable<
  GetBatchAuctionLotQuery["batchAuctionLot"]
>;

export type SubgraphAuction = AtomicSubgraphAuction | BatchSubgraphAuction;

export type AuctionEncryptedBid = BatchBaseSubgraphAuction["bids"][0];

export type AuctionDecryptedBid = BatchBaseSubgraphAuction["bidsDecrypted"][0];

export type AuctionRefundedBid = BatchBaseSubgraphAuction["bidsRefunded"][0];

export type AuctionPurchase = AtomicBaseSubgraphAuction["purchases"][0];
