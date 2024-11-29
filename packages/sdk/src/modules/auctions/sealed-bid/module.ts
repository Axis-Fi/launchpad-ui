import { encodeAbiParameters, Hex, parseUnits } from "viem";
import { AuctionType } from "@repo/types";
import type { CreateParams } from "../../../core/create";
import { SdkError } from "../../../types";
import { toBasisPoints } from "../utils";
import { abi } from "./abi";

const getAuctionModuleParams = ({ auction, tokens }: CreateParams): Hex => {
  if (auction.type !== AuctionType.SEALED_BID) {
    throw new SdkError(
      "sealed-bid getAuctionModuleParams() should only be called on sealed-bid auctions. Received type: " +
        auction.type,
    );
  }

  if (
    auction.minBidSize !== null ||
    auction.minFillPercent !== null ||
    auction.minPrice !== null
  ) {
    throw new SdkError(
      "sealed-bid getAuctionModuleParams() requires a price and minFillPercent",
    );
  }

  const params = [
    {
      minFillPercent: toBasisPoints(auction.minFillPercent),
      minBidSize: parseUnits(auction.minBidSize, tokens.quote.decimals),
      minPrice: parseUnits(auction.minPrice, tokens.quote.decimals),
      publicKey: auction.publicKey,
    },
  ] as const;

  return encodeAbiParameters(abi, params);
};

export { getAuctionModuleParams };
