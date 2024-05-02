import {
  GetAtomicAuctionLotQuery,
  GetAuctionLotsQuery,
  GetBatchAuctionLotQuery,
} from "@repo/subgraph-client/src/generated";

export type AtomicBaseSubgraphAuction =
  GetAuctionLotsQuery["atomicAuctionLots"][0];
export type BatchBaseSubgraphAuction =
  GetAuctionLotsQuery["batchAuctionLots"][0];

export type RawSubgraphAuction =
  | AtomicBaseSubgraphAuction
  | BatchBaseSubgraphAuction;

export type AtomicSubgraphAuction =
  GetAtomicAuctionLotQuery["atomicAuctionLot"];

export type BatchSubgraphAuction = NonNullable<
  GetBatchAuctionLotQuery["batchAuctionLot"]
>;

export type AuctionEncryptedBid = BatchBaseSubgraphAuction["bids"][0];

export type AuctionDecryptedBid = BatchBaseSubgraphAuction["bidsDecrypted"][0];

export type AuctionRefundedBid = BatchBaseSubgraphAuction["bidsRefunded"][0];

export type AuctionPurchase = AtomicBaseSubgraphAuction["purchases"][0];
