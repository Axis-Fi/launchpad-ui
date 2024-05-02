import { AuctionModuleReference, AuctionType } from "@repo/types";

const auctionTypes: Record<AuctionModuleReference, AuctionType> = {
  "01EMPA": AuctionType.SEALED_BID,
  "01FPSA": AuctionType.FIXED_PRICE, //TODO: fix this mapping
};

export const auctionHouseTypes: Record<AuctionType, string> = {
  [AuctionType.FIXED_PRICE]: "atomic",
  [AuctionType.SEALED_BID]: "batch",
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
