import { GetAuctionLotQuery, GetAuctionLotsQuery } from "@repo/subgraph-client";
import { Token, AuctionStatus, AuctionInfo } from "src/types";

type RawSubgraphAuctionWithEvents = GetAuctionLotQuery["auctionLots"][0];
type RawSubgraphAuction = GetAuctionLotsQuery["auctionLots"][0];

export type SubgraphAuctionWithEvents = {
  chainId: number;
  status: AuctionStatus;
  baseToken: Token;
  quoteToken: Token;
  auctionInfo?: AuctionInfo;
} & RawSubgraphAuctionWithEvents;

export type SubgraphAuction = {
  chainId: number;
  status: AuctionStatus;
  baseToken: Token;
  quoteToken: Token;
  auctionInfo?: AuctionInfo;
} & RawSubgraphAuction;

export type SubgraphAuctionEncryptedBid =
  RawSubgraphAuctionWithEvents["bids"][0];

export type SubgraphAuctionDecryptedBid =
  RawSubgraphAuctionWithEvents["bidsDecrypted"][0];

export type SubgraphAuctionRefundedBid =
  RawSubgraphAuctionWithEvents["refundedBids"][0];
