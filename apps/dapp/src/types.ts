import { GetAuctionLotQuery, GetAuctionLotsQuery } from "@repo/subgraph-client";
import { Address } from "viem";

export type Token = {
  chainId: number;
  address: Address;
  decimals: number;
  symbol: string;
  name: string;
};

export type AuctionStatus =
  | "created"
  | "live"
  | "concluded"
  | "decrypted"
  | "settled";

export type Auction = GetAuctionLotsQuery["auctionLots"][0] & {
  chainId: number;
  status: AuctionStatus;
};

export type AuctionWithEvents = GetAuctionLotQuery["auctionLots"][0] & {
  chainId: number;
  status: AuctionStatus;
};
