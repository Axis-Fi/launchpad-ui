import { RawSubgraphAuctionWithEvents } from "./subgraph-types";

export type Token = {
  address: string;
  decimals: string;
  symbol: string;
  name: string;
  chainId?: number;
  logoURL?: string;
};

export type Auction = RawSubgraphAuctionWithEvents & {
  chainId: number;
  baseToken: Token;
  quoteToken: Token;
  status: AuctionStatus;
  auctionInfo?: AuctionInfo;
};

export type AuctionStatus =
  | "created"
  | "live"
  | "concluded"
  | "decrypted"
  | "settled";

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

export type PropsWithAuction = {
  auction: Auction;
};
