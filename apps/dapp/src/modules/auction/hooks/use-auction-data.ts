import { axisContracts } from "@repo/deployments";
import {
  AuctionType,
  type AxisModuleContractNames,
  type EMPAuctionData,
  type FixedPriceBatchAuctionData,
} from "@repo/types";
import { parseUnits, type ReadContractErrorType } from "viem";
import { useReadContract } from "wagmi";
import { moduleMap } from "utils/contracts";
import type {
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";

type UseAuctionDataParameters = {
  lotId?: string;
  chainId?: number;
  type?: AuctionType;
};

export type UseAuctionDataReturn = {
  data?: EMPAuctionData | FixedPriceBatchAuctionData;
  refetch: (
    options?: RefetchOptions,
  ) => Promise<
    QueryObserverResult<
      EMPAuctionData | FixedPriceBatchAuctionData,
      ReadContractErrorType
    >
  >;
};

/** Reads and parses auctionData for a specific auction on chain */
export function useAuctionData({
  lotId,
  chainId,
  type = AuctionType.SEALED_BID,
}: UseAuctionDataParameters): UseAuctionDataReturn {
  const auctionModule = moduleMap[type] as AxisModuleContractNames;
  const auctionDataQuery = useReadContract({
    chainId,
    abi: axisContracts.abis[auctionModule],
    address: !chainId
      ? undefined
      : axisContracts.addresses[chainId][auctionModule],
    functionName:
      type === AuctionType.FIXED_PRICE_BATCH ? "getAuctionData" : "auctionData",
    args: [parseUnits(lotId ?? "0", 0)],
    query: { enabled: !!chainId && !!lotId },
  });
  const handle = handlers[type];

  return {
    ...auctionDataQuery,
    data: auctionDataQuery.isSuccess
      ? //@ts-expect-error improve typing
        handle(auctionDataQuery.data)
      : undefined,
    refetch: auctionDataQuery.refetch as UseAuctionDataReturn["refetch"],
  };
}

const handlers = {
  [AuctionType.SEALED_BID]: mapEMPAuctionData,
  [AuctionType.FIXED_PRICE_BATCH]: mapFixedPriceBatchData,
};

/** Maps the result of view function auctionData into a readable format */
function mapEMPAuctionData(
  data:
    | readonly [
        bigint,
        bigint,
        number,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        { x: bigint; y: bigint },
        bigint,
        bigint[],
      ]
    | undefined,
): EMPAuctionData | undefined {
  if (!data) return undefined;
  return {
    nextBidId: data[0],
    nextDecryptIndex: data[1],
    status: data[2],
    marginalBidId: data[3],
    marginalPrice: data[4],
    minimumPrice: data[5],
    minFilled: data[6],
    minBidSize: data[7],
    publicKey: data[8],
    privateKey: data[9],
    bidIds: data[10],
  };
}

function mapFixedPriceBatchData(
  data: FixedPriceBatchAuctionData | undefined,
): FixedPriceBatchAuctionData | undefined {
  return data;
}
