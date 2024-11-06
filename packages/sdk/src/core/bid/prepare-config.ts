import { toHex } from "viem";
import { abis } from "@repo/abis";
import type { BidConfig, PrimedBidParams } from "./types";

const prepareConfig = (
  params: PrimedBidParams,
  callbackData: `0x${string}`,
): BidConfig => {
  const {
    lotId,
    amountIn,
    bidderAddress,
    referrerAddress,
    auctionHouseAddress,
    auctionData,
  } = params;

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "bid",
    args: [
      {
        lotId: BigInt(lotId),
        bidder: bidderAddress,
        referrer: referrerAddress,
        amount: amountIn,
        auctionData: auctionData || toHex(""),
        permit2Data: toHex(""), // TODO: handle permit2Data
      },
      callbackData,
    ],
  };
};

export { prepareConfig };
