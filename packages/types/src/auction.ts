import { AuctionType } from "./auction-modules";
import {
  RawSubgraphAuction,
  RawSubgraphAuctionWithEvents,
} from "./subgraph-queries";
import { Token } from "./token";

export type BaseAuction = {
  chainId: number;
  baseToken: Token;
  quoteToken: Token;
  status: AuctionStatus;
  auctionInfo?: AuctionInfo;
  auctionData?: EMPAuctionData | FixedPriceAuctionData;
  auctionType: AuctionType;
  formatted?: AuctionFormattedInfo;
  linearVesting?: LinearVestingData;
};

export type Auction = BaseAuction &
  Omit<RawSubgraphAuctionWithEvents, "baseToken" | "quoteToken">;

export type AuctionListed = Omit<BaseAuction, "auctionData" | "formatted"> &
  Omit<RawSubgraphAuction, "baseToken" | "quoteToken">;

export type AuctionStatus =
  | "created"
  | "live"
  | "concluded"
  | "decrypted"
  | "settled";

export type AuctionInfo = {
  key?: string;
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

export type EMPAuctionData = {
  status: number;
  nextDecryptIndex: bigint;
  nextBidId: bigint;
  minimumPrice: bigint;
  minFilled: bigint;
  minBidSize: bigint;
  marginalPrice: bigint;
  marginalBidId: bigint;
  publicKey: { x: bigint; y: bigint };
  privateKey: bigint;
  proceedsClaimed: boolean;
  bidIds: bigint[];
};

export type FixedPriceAuctionData = {
  price: bigint;
  maxPayoutPercentage: bigint;
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
  totalBidAmount: string;
  uniqueBidders: number;
  rate?: string;
  purchased: string;
  sold: string;
  minPrice?: string;
  minBidSize?: string;
  tokenPairSymbols: string;
  capacity: string;
  totalSupply: string;
  price?: string;
  maxPayoutPercentage?: number;
  auctionType?: string;
} & Partial<EMPFormattedInfo>;

//TODO: add remaining fields
type EMPFormattedInfo = {
  marginalPrice: string;
};

export type LinearVestingData = {
  start: number;
  expiry: number;
  startDate: Date;
  expiryDate: Date;
  days: number;
  daysFromNow: number;
  isVestingExpired: boolean;
};

export type PropsWithAuction = {
  auction: Auction;
};
