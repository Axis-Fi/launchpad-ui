import { AuctionType } from "@repo/types";

export const auctionMetadata: Record<
  AuctionType,
  { label: string; tooltip: string }
> = {
  [AuctionType.SEALED_BID]: {
    label: "EMP",
    tooltip:
      "Encrypted Marginal Price Auction is a fully on-chain, sealed-bid, batch auction system built on the Axis Protocol that uses ECIES encryption and a multi-step settlement process to avoid issues of previous sealed bid auction designs.",
  },
  [AuctionType.FIXED_PRICE]: {
    label: "FP",
    tooltip:
      "Fixed Price Auction is a fully on-chain, fixed-price batch auction system",
  },
};
