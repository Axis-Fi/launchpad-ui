import * as v from "valibot";
import { abis } from "@repo/abis";
import { getAuctionHouse } from "@repo/deployments";
import schema from "../schema";
import { SdkError } from "../../../types";

import type { ClaimBidsConfig, ClaimBidsParams } from "../types";

const getConfig = (params: ClaimBidsParams): ClaimBidsConfig => {
  const parsedParams = v.safeParse(schema, params);

  if (!parsedParams.success) {
    throw new SdkError(
      "Invalid parameters supplied to getConfig()",
      parsedParams.issues,
    );
  }
  const { lotId, bids, chainId, auctionType } = params;

  const auctionHouseAddress = getAuctionHouse({ chainId, auctionType })
    ?.address;

  return {
    abi: abis.batchAuctionHouse,
    address: auctionHouseAddress,
    functionName: "claimBids",
    args: [BigInt(lotId), bids.map(BigInt)],
  };
};

export { getConfig };
