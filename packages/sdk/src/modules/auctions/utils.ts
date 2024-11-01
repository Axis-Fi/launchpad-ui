import { AuctionType } from "@repo/types";
import type { CreateParams } from "../../core/create";
import { getAuctionModuleParams as getFixedPriceAuctionModuleParams } from "./fixed-price/module";
import { getAuctionModuleParams as getSealedBidAuctionModuleParams } from "./sealed-bid/module";

/** Converts a number or string into basis points format
 * 1% -> 100
 */
export function toBasisPoints(percentage: string | number) {
  const _percentage =
    typeof percentage === "string" ? parseFloat(percentage) : percentage;

  return _percentage * 100;
}

export const getAuctionModuleParams = (params: CreateParams) => {
  const { auction } = params;
  if (auction.type === AuctionType.SEALED_BID) {
    return getSealedBidAuctionModuleParams(params);
  }

  if (auction.type === AuctionType.FIXED_PRICE_BATCH) {
    return getFixedPriceAuctionModuleParams(params);
  }

  return "0x";
};
