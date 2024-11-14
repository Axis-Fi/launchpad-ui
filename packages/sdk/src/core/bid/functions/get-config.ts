import * as v from "valibot";
import type { CloakClient } from "@repo/cloak";
import { getAuctionHouse, type AxisDeployments } from "@repo/deployments";
import { SdkError } from "../../../types";
import { BidParamsSchema } from "../schema";
import type { BidConfig, BidParams } from "../types";
import { getEncryptedBid } from "../utils";
import type { AuctionModule } from "../../auction";
import { getConfigFromPrimedParams } from "./get-config-from-primed-params";
import { AuctionType } from "@repo/types";
import { encodeEncryptedBid } from "../utils";

const getConfig = async (
  params: BidParams,
  callbackData: `0x${string}`,
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

  const auctionHouseAddress = getAuctionHouse({ chainId, auctionType })
    ?.address;

  if (auctionHouseAddress === undefined || auctionHouseAddress === "0x") {
    throw new SdkError(
      `Auction house contract address not found for chainId ${chainId} and auctionType ${auctionType}`,
    );
  }

  const { quoteTokenDecimals, baseTokenDecimals } =
    await auction.functions.getAuctionTokenDecimals(
      { lotId, chainId, auctionType },
      deployments,
    );

  const shouldEncryptBid = auctionType === AuctionType.SEALED_BID;

  const paramsToEncrypt = {
    ...params,
    quoteTokenDecimals,
    baseTokenDecimals,
    auctionHouseAddress,
  };

  const encryptedBid = shouldEncryptBid
    ? encodeEncryptedBid(await getEncryptedBid(paramsToEncrypt, cloakClient))
    : undefined;

  return getConfigFromPrimedParams(
    {
      lotId,
      amountIn,
      bidderAddress,
      referrerAddress,
      auctionHouseAddress,
      quoteTokenDecimals,
      auctionData: encryptedBid,
    },
    callbackData,
  );
};

export { getConfig };
