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

export type Auction = {
  id: number;
  status: AuctionStatus;
  chainId: number;
  quoteToken: string;
  payoutToken: string;
  deadline: number;
  capacity: number;
};
