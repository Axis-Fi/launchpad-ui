import { toHex, parseUnits } from "viem";
import { abis } from "@repo/abis";
import type { BidConfig, PrimedBidParams } from "../types";

const getConfigFromPrimedParams = (
  params: PrimedBidParams,
  callbackData: `0x${string}`,
): BidConfig => {
  const {
    lotId,
    amountIn,
    bidderAddress,
    referrerAddress,
    auctionHouseAddress,
    quoteTokenDecimals,
    auctionData,
  } = params;

  // const callbackData = toHex(""); //TODO: callbackData - decide best way to handle this

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "bid",
    args: [
      {
        lotId: BigInt(lotId),
        bidder: bidderAddress,
        referrer: referrerAddress,
        amount: parseUnits(amountIn.toString(), quoteTokenDecimals),
        auctionData: auctionData || toHex(""),
        permit2Data: toHex(""), // TODO: handle permit2Data
      },
      callbackData,
    ],
  };
};

export { getConfigFromPrimedParams };
