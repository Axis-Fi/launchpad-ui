import { getCatalogue } from "@repo/deployments";
import { createClient } from "../../public-client";
import type { GetAuctionParams, GetAuctionResult } from "../types";
import { SdkError } from "../../../types";

const getAuction = async (
  params: GetAuctionParams,
): Promise<GetAuctionResult> => {
  const { chainId, lotId, auctionType } = params;
  const client = createClient(chainId);
  const catalogue = getCatalogue({ chainId, auctionType });

  if (catalogue === undefined) {
    throw new SdkError(
      `Can't find catalogue for auctionType ${auctionType} and chainId ${chainId}`,
    );
  }

  return client.readContract({
    address: catalogue.address,
    abi: catalogue.abi,
    functionName: "getRouting",
    args: [BigInt(lotId)],
  });
};

export { getAuction };
