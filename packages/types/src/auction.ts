import { AuctionType } from "./auction-modules";
import { Address } from "./axis-contracts";
import { BatchSubgraphAuction } from "./subgraph-queries";
import type { Token } from "./token";

export type BaseAuction = {
  chainId: number;
  baseToken: Token;
  quoteToken: Token;
  callbacks: Address;
  status: AuctionStatus;
  auctionType: AuctionType;
  formatted?: AuctionFormattedInfo;
  /** Whether the auction passes the malicious auction verification */
  isSecure?: boolean;
};

export type Auction = BatchAuction;

export type BatchAuction = BaseAuction &
  Omit<BatchSubgraphAuction, "baseToken" | "quoteToken">;

//TODO: see if necessary again, used to branch between auctions in list and detailed view
export type AuctionListed = Auction; //Omit<BaseAuction, "auctionData" | "formatted"> & Omit<RawSubgraphAuction, "baseToken" | "quoteToken">;

export type AuctionStatus =
  | "created"
  | "cancelled"
  | "live"
  | "concluded"
  | "decrypted"
  | "aborted"
  | "settled";

type AllowList = string[][] | undefined;

export type AuctionInfo = BatchAuction["info"] & { allowlist: AllowList };

export type AuctionLinkId =
  | "website"
  | "payoutTokenLogo"
  | "projectLogo"
  | "projectBanner"
  | "discord"
  | "website"
  | "farcaster"
  | "twitter";

export type AuctionLink = NonNullable<Auction["info"]>["links"][number];

export type AuctionFormattedInfo = {
  startDate: Date;
  endDate: Date;
  startFormatted: string;
  endFormatted: string;
  startDistance: string;
  endDistance: string;
  rate?: string;
  purchased: string;
  purchasedDecimal: number;
  sold: string;
  minPrice?: string;
  minBidSize?: string;
  tokenPairSymbols: string;
  capacity: string;
  totalSupply: string;
  price?: string;
  auctionType?: string;
} & Partial<EMPFormattedInfo>;

export type EMPFormattedInfo = {
  marginalPrice: string;
  marginalPriceDecimal: number;
  totalBids: number;
  totalBidsDecrypted: number;
  totalBidsClaimed: number;
  totalBidAmountFormatted: string;
  totalBidAmountDecimal: number;
  minFilled: string;
  uniqueBidders: number;
  cleared: boolean;
  rate: string;
  minPrice: string;
  minBidSize: string;
};

export type FPBFormattedInfo = {
  price: string;
  totalBids: number;
  totalBidsClaimed: number;
  totalBidAmountFormatted: string;
  totalBidAmountDecimal: number;
  uniqueBidders: number;
  cleared: boolean;
  minFilled: string;
};

export type PropsWithAuction = {
  auction: Auction;
};

export type AuctionId = `${string}-${string}-${number}`;
