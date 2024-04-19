import { toHex, parseUnits } from "viem";
import * as v from "valibot";
import { abis } from "@repo/abis";
import type { CloakClient } from "@repo/cloak";
import { SdkError } from "../../types";
import { getContractAddresses, auction } from "..";
import { BidParamsSchema } from "./schema";
import type { BidConfig, BidParams, GetBidConfigParams } from "./types";
import { encryptBid, encodeEncryptedBid } from "./utils";

const getBidConfig = (params: GetBidConfigParams): BidConfig => {
  const {
    lotId,
    amountIn,
    referrerAddress,
    auctionHouseAddress,
    quoteTokenDecimals,
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
        referrer: referrerAddress,
        amount: parseUnits(amountIn.toString(), quoteTokenDecimals),
        auctionData: encodeEncryptedBid(encryptedBid),
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

  const { quoteTokenDecimals, baseTokenDecimals } =
    await auction.getAuctionTokenDecimals({ lotId, chainId });

  const auctionHouseAddress = getContractAddresses(chainId)?.auctionHouse;

  const encryptBidParams = {
    ...params,
    quoteTokenDecimals,
    baseTokenDecimals,
    auctionHouseAddress,
  };

  const encryptedBid = await encryptBid(encryptBidParams, cloakClient);

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
    quoteTokenDecimals,
    encryptedBid,
  });
};

export { getBidConfig, bid };
