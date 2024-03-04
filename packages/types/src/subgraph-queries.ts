import {
  GetAuctionLotQuery,
  GetAuctionLotsQuery,
} from "@repo/subgraph-client/src/generated";

export type RawSubgraphAuctionWithEvents = GetAuctionLotQuery["auctionLots"][0];
export type RawSubgraphAuction = GetAuctionLotsQuery["auctionLots"][0];

export type AuctionEncryptedBid = RawSubgraphAuctionWithEvents["bids"][0];

export type AuctionDecryptedBid =
  RawSubgraphAuctionWithEvents["bidsDecrypted"][0];

export type AuctionRefundedBid =
  RawSubgraphAuctionWithEvents["refundedBids"][0];
