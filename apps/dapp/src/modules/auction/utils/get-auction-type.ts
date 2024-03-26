import { AuctionModuleReference, AuctionType } from "@repo/types";
import { fromVeecode } from "utils/hex";

const auctionTypes: Record<AuctionModuleReference, AuctionType> = {
  "01EMPAM": AuctionType.SEALED_BID,
  "01FPAM\x00": AuctionType.FIXED_PRICE, //TODO: fix this mapping
};

export function getAuctionType(auctionRef: string) {
  const key = fromVeecode(auctionRef).trim() as AuctionModuleReference;
  const type = auctionTypes[key];

  if (!type) {
    throw new Error(
      `Unable to find AuctionType for hex:${auctionRef}->decoded:${key}`,
    );
  }

  return type;
}
