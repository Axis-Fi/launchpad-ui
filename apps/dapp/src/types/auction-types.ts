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
  auctionData?: AuctionData;
  formatted?: AuctionFormattedInfo;
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

export type AuctionData = {
  status: number;
  nextDecryptIndex: bigint;
  nextBidId: bigint;
  minimumPrice: bigint;
  minFilled: bigint;
  minBidSize: bigint;
  publicKeyModulus: `0x${string}`;
};

export type AuctionFormattedInfo = {
  startDate: Date;
  endDate: Date;
  startFormatted: string;
  endFormatted: string;
  startDistance: string;
  endDistance: string;
  totalBids: number;
  totalBidsDecrypted: number;
  totalBidAmount: number;
  uniqueBidders: number;
  rate: string;
  tokenAmounts: {
    in: number;
    out: number;
  };
  minPrice: string;
  minBidSize: string;
};

export enum AuctionTypes {
  SEALED_BID = "LSBBA",
}

export type PropsWithAuction = {
  auction: Auction;
};
