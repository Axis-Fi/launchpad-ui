import { GetAuctionLotsQuery } from "@repo/subgraph-client";
import { Address } from "viem";

export type Token = {
  chainId: number;
  address: Address;
  decimals: string;
  symbol: string;
  name: string;
  logoURL?: string;
};

export type AuctionStatus =
  | "created"
  | "live"
  | "concluded"
  | "decrypted"
  | "settled";

export type AuctionSocialAssets = {
  description?: string;
  name?: string;
};

export type Auction = GetAuctionLotsQuery["auctionLots"][0] & {
  chainId: number;
  status: AuctionStatus;
  baseToken: Token;
  quoteToken: Token;
} & AuctionSocialAssets;

export type AuctionWithEvents = {
  chainId: number;
  status: AuctionStatus;
} & Auction;
