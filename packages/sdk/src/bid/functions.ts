import { toHex, parseUnits } from "viem";
import * as v from "valibot";
import { abis } from "@repo/abis";
import type { CloakClient } from "@repo/cloak";
import { SdkError } from "../types";
import { BidParamsSchema } from "./schema";
import type { BidConfig, BidParams, GetBidConfigParams } from "./types";
import * as utils from "./utils";

const getBidConfig = (params: GetBidConfigParams): BidConfig => {
  const {
    lotId,
    amountIn,
    referrerAddress,
    auctionHouseAddress,
    quoteToken,
    encryptedBid,
  } = params;
  const callbackData = toHex(""); //TODO: callbackData - decide best way to handle this

  return {
    abi: abis.auctionHouse,
    address: auctionHouseAddress,
    functionName: "bid",
    args: [
      {
        lotId: BigInt(lotId),
        referrer: toHex(referrerAddress),
        amount: parseUnits(amountIn.toString(), quoteToken.decimals),
        auctionData: utils.encodeEncryptedBid(encryptedBid),
        permit2Data: toHex(""), // TODO: handle permit2Data
      },
      callbackData,
    ],
  };
};

const bid = async (
  params: BidParams,
  cloakClient: CloakClient,
): Promise<BidConfig> => {
  const parsedParams = v.safeParse(BidParamsSchema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to bid",
      parsedParams.issues,
    );
  }

  const { lotId, amountIn, referrerAddress, chainId } = params;
  const { quoteToken, baseToken } = await utils.getAuction({ lotId, chainId });
  const auctionHouseAddress = utils.getContractAddresses(chainId)?.auctionHouse;

  // TODO: the next async call can fail, review error handling
  const encryptBidParams = {
    ...params,
    quoteToken,
    baseToken,
    auctionHouseAddress,
  };
  const encryptedBid = await utils.encryptBid(encryptBidParams, cloakClient);

  if (
    !encryptedBid ||
    !encryptedBid.ciphertext ||
    !encryptedBid.x ||
    !encryptedBid.y
  ) {
    throw new SdkError("Failed to encrypt bid via cloak service");
  }

  return getBidConfig({
    lotId,
    amountIn,
    referrerAddress,
    auctionHouseAddress,
    quoteToken,
    encryptedBid,
  });
};

export { getBidConfig, bid };
