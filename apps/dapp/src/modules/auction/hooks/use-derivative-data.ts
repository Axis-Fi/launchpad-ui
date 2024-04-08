import { axisContracts } from "@repo/deployments";
import { getAuctionHouse } from "utils/contracts";
import { fromHex } from "viem";
import { UseReadContractReturnType, useReadContract } from "wagmi";
import { decodeLinearVestingParams } from "../utils/get-derivative-params";
import { AuctionDerivatives } from "@repo/types";

export function useDerivativeData(lotId?: string, chainId?: number) {
  const { abi, address } = getAuctionHouse(chainId);

  const response = useReadContract({
    abi,
    address,
    functionName: "lotRouting",
    args: [BigInt(lotId ?? 0n)],
    query: { enabled: !!lotId && !!chainId },
  });

  return {
    ...response,
    data: response.isSuccess ? parseRoutingParams(response.data) : undefined,
  };
}

type LotRoutingStruct = UseReadContractReturnType<
  typeof axisContracts.abis.auctionHouse,
  "lotRouting"
>["data"];

function parseRoutingParams(lotRouting: LotRoutingStruct) {
  if (!lotRouting) {
    throw new Error("No lot routing information");
  }

  const derivativeRef = fromHex(lotRouting[6], "string").substring(2, 5);

  // {seller: lotRouting[0],
  // funding: lotRouting[1],
  // callbacks: lotRouting[5],
  // derivativeRef,
  // wrapDerivative: lotRouting[7]}
  if (derivativeRef === AuctionDerivatives.LINEAR_VESTING) {
    return decodeLinearVestingParams(lotRouting[8]);
  }
}
