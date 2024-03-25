import { AuctionModules } from "@repo/types";
import { fromVeecode } from "utils/hex";

const auctionTypes: Record<AuctionModules, string> = {
  "01EMPAM": "EMP",
  "02FPAM": "FP",
};

export function getAuctionType(auctionRef: string) {
  const key = fromVeecode(auctionRef) as AuctionModules;
  const type = auctionTypes[key];

  if (!type) {
    throw new Error(
      `Unable to find AuctionType for hex:${auctionRef}->decoded:${key}`,
    );
  }

  return type;
}
