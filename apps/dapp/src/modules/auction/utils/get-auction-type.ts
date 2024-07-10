import { type AuctionModuleReference, AuctionType } from "@repo/types";

const auctionTypes: Record<AuctionModuleReference, AuctionType> = {
  "01EMPA": AuctionType.SEALED_BID,
  "01FPBA": AuctionType.FIXED_PRICE_BATCH,
};

export const auctionHouseTypes: Record<AuctionType, string> = {
  [AuctionType.SEALED_BID]: "batch",
  [AuctionType.FIXED_PRICE_BATCH]: "batch",
};

export function getAuctionType(auctionRef?: string) {
  if (!auctionRef) return;
  const key = auctionRef as AuctionModuleReference;
  const type = auctionTypes[key];

  if (!type) {
    throw new Error(
      `Unable to find AuctionType for hex:${auctionRef}->decoded:${key}`,
    );
  }

  return type;
}
