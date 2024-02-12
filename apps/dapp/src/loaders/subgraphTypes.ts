import { GetAuctionLotQuery, GetAuctionLotsQuery } from "@repo/subgraph-client";
import { AuctionStatus } from "src/types";

type RawSubgraphAuctionWithEvents = GetAuctionLotQuery["auctionLots"][0];
type RawSubgraphAuction = GetAuctionLotsQuery["auctionLots"][0];

export type SubgraphAuctionWithEvents = {
  chainId: number;
  status: AuctionStatus;
} & RawSubgraphAuctionWithEvents;

export type SubgraphAuction = {
  chainId: number;
  status: AuctionStatus;
} & RawSubgraphAuction;
