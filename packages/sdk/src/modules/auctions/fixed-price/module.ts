import { encodeAbiParameters } from "viem";
import { AuctionType } from "@repo/types";
import type { CreateParams } from "../../../core/create";
import { SdkError } from "../../../types";
import { toBasisPoints } from "../utils";
import { abi } from "./abi";

const getAuctionModuleParams = ({ auction }: CreateParams) => {
  if (auction.type !== AuctionType.FIXED_PRICE_BATCH) {
    throw new SdkError(
      "fixed-price getAuctionModuleParams() should only be called on fixed-price auctions. Received type: " +
        auction.type,
    );
  }
  if (auction.price == null || auction.minFillPercent) {
    throw new SdkError(
      "fixed-price getAuctionModuleParams() requires a price and minFillPercent",
    );
  }

  const params = [
    {
      price: auction.price,
      minFillPercent: toBasisPoints(auction.minFillPercent),
    },
  ] as const;

  return encodeAbiParameters(abi, params);
};

export { getAuctionModuleParams };
