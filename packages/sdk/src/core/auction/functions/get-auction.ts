import { abis } from "@repo/abis";
import type { AxisDeployments } from "@repo/deployments";
import { createClient } from "../../public-client";
import { getContractAddresses } from "../../utils";
import type { GetAuctionParams, GetAuctionResult } from "../types";

const getAuction = async (
  params: GetAuctionParams,
  deployments: AxisDeployments,
): Promise<GetAuctionResult> => {
  const { chainId, lotId } = params;
  const client = createClient(chainId);

  return client.readContract({
    address: getContractAddresses(chainId, deployments)?.catalogue,
    abi: abis.catalogue,
    functionName: "getRouting",
    args: [BigInt(lotId)],
  });
};

export { getAuction };
