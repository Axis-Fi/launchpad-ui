import { toHex, parseUnits } from "viem";
import * as v from "valibot";
import { abis } from "@repo/abis";
import type { CloakClient } from "@repo/cloak";
import { getAuctionHouse, type AxisDeployments } from "@repo/deployments";
import { SdkError } from "../../types";
import { BidParamsSchema } from "./schema";
import type { BidConfig, BidParams, PrimedBidParams } from "./types";
import { encryptBid, encodeEncryptedBid } from "./utils";
import type { AuctionModule } from "../auction";

const getConfigFromPrimedParams = (params: PrimedBidParams): BidConfig => {
  const {
    lotId,
    amountIn,
    bidderAddress,
    referrerAddress,
    auctionHouseAddress,
    quoteTokenDecimals,
    encryptedBid,
  } = params;

  const callbackData = toHex(""); //TODO: callbackData - decide best way to handle this

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
        auctionData: encodeEncryptedBid(encryptedBid),
        permit2Data: toHex(""), // TODO: handle permit2Data
      },
      callbackData,
    ],
  };
};

const getConfig = async (
  params: BidParams,
  cloakClient: CloakClient,
  auction: AuctionModule,
  deployments: AxisDeployments,
): Promise<BidConfig> => {
  const parsedParams = v.safeParse(BidParamsSchema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig",
      parsedParams.issues,
    );
  }

  const {
    lotId,
    amountIn,
    bidderAddress,
    referrerAddress,
    chainId,
    auctionType,
  } = params;

  const { quoteTokenDecimals, baseTokenDecimals } =
    await auction.functions.getAuctionTokenDecimals(
      { lotId, chainId, auctionType },
      deployments,
    );

  const auctionHouseAddress = getAuctionHouse({ chainId, auctionType })
    ?.address;

  if (auctionHouseAddress === undefined || auctionHouseAddress === "0x") {
    throw new SdkError(
      `Auction house contract address not found for chainId ${chainId} and auctionType ${auctionType}`,
    );
  }

  const encryptBidParams = {
    ...params,
    quoteTokenDecimals,
    baseTokenDecimals,
    auctionHouseAddress,
  };

  const encryptedBid = await encryptBid(encryptBidParams, cloakClient);

  return getConfigFromPrimedParams({
    lotId,
    amountIn,
    bidderAddress,
    referrerAddress,
    auctionHouseAddress,
    quoteTokenDecimals,
    encryptedBid,
  });
};

export { getConfigFromPrimedParams, getConfig };
