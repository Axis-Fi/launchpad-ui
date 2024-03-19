import { axisContracts } from "@repo/deployments";
import { AuctionData } from "@repo/types";
import { parseUnits } from "viem";
import { useReadContract } from "wagmi";

type UseAuctionDataParameters = {
  lotId?: string;
  chainId?: number;
};

/** Reads auctionData for a specific auction on chain and parses it*/
export function useAuctionData({ lotId, chainId }: UseAuctionDataParameters) {
  const auctionDataQuery = useReadContract({
    abi: axisContracts.abis.empam,
    address: !chainId ? undefined : axisContracts.addresses[chainId].empam,
    functionName: "auctionData",
    args: [parseUnits(lotId ?? "0", 0)],
    query: { enabled: !!chainId && !!lotId },
  });

  return {
    ...auctionDataQuery,
    data: auctionDataQuery.isSuccess
      ? mapAuctionData(auctionDataQuery.data)
      : undefined,
  };
}

/** Maps the result of view function auctionData into a readable format */
const mapAuctionData = (
  data:
    | readonly [number, bigint, bigint, bigint, bigint, bigint, `0x${string}`]
    | undefined,
): AuctionData | undefined => {
  if (!data) return undefined;

  return {
    status: data[0],
    nextDecryptIndex: data[1],
    nextBidId: data[2],
    minimumPrice: data[3],
    minFilled: data[4],
    minBidSize: data[5],
    publicKeyModulus: data[6],
  };
};
