import { parseUnits } from "viem";
import * as v from "valibot";
import { getAuctionHouse } from "@repo/deployments";
import { abis } from "@repo/abis";
import { schema } from "./schema";
import { type MetadataClient, SdkError } from "../../types";
import type { CreateConfig, CreateParams } from "./types";
import { getTimestamp, toKeycode, storeMetadata } from "./utils";
import { getAuctionModuleParams } from "../../modules/auctions/utils";

const getConfig = async (
  params: CreateParams,
  metadataClient: MetadataClient,
): Promise<CreateConfig> => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }

  const { chainId, auction, tokens, callback, derivative } = params;

  const auctionType = auction.type;
  const auctionKeyCode = toKeycode(auctionType);

  const auctionHouse = getAuctionHouse({ chainId, auctionType });

  const auctionModuleParams = getAuctionModuleParams(params);

  const metadataIpfsHash = await storeMetadata(
    params.auction.metadata,
    metadataClient,
  );

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouse.address,
    functionName: "auction",
    args: [
      {
        auctionType: auctionKeyCode,
        baseToken: tokens.base.address,
        quoteToken: tokens.quote.address,
        curator: auction.curator,
        referrerFee: auction.referrerFee,
        callbacks: callback.address,
        callbackData: callback.data,
        derivativeType: derivative.type,
        derivativeParams: derivative.params,
        wrapDerivative: derivative.wrap,
      },
      {
        start: getTimestamp(auction.startDate),
        duration:
          getTimestamp(auction.endDate) - getTimestamp(auction.startDate),
        capacityInQuote: false, // Batch auctions do not allow capacity in quote
        capacity: parseUnits(auction.capacity, tokens.base.decimals),

        implParams: auctionModuleParams,
      },
      metadataIpfsHash,
    ],
  };
};

export { getConfig };
