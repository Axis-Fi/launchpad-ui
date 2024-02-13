import { GetAuctionLotsQuery } from "@repo/subgraph-client";

export type Token = {
  address: string;
  decimals: string;
  symbol: string;
  name: string;
  chainId?: number;
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

export type AuctionInfo = {
  name?: string;
  description?: string;
  links?: {
    projectLogo?: string;
    website?: string;
    twitter?: string;
    discord?: string;
    farcaster?: string;
    payoutTokenLogo?: string;
    [key: string]: string | undefined;
  };
};
