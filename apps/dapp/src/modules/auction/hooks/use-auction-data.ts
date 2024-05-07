import { axisContracts } from "@repo/deployments";
import {
  EMPAuctionData,
  AuctionType,
  AxisContractAddresses,
  FixedPriceAuctionData,
} from "@repo/types";
import { parseUnits } from "viem";
import { useReadContract } from "wagmi";

type UseAuctionDataParameters = {
  lotId?: string;
  chainId?: number;
  type?: AuctionType;
};

/** Reads auctionData for a specific auction on chain and parses it*/
export function useAuctionData({
  lotId,
  chainId,
  type = AuctionType.SEALED_BID,
}: UseAuctionDataParameters) {
  const auctionType = type.toLocaleLowerCase() as keyof AxisContractAddresses;
  const auctionDataQuery = useReadContract({
    abi: axisContracts.abis[auctionType],
    address: !chainId
      ? undefined
      : axisContracts.addresses[chainId][auctionType],
    functionName: "auctionData",
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
  };
}

const handlers = {
  [AuctionType.SEALED_BID]: mapEMPAuctionData,
  [AuctionType.FIXED_PRICE]: mapFixedPriceData,
};

/** Maps the result of view function auctionData into a readable format */
function mapEMPAuctionData(
  data:
    | readonly [
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        bigint,
        number,
        bigint,
        { x: bigint; y: bigint },
        bigint,
      ]
    | undefined,
): EMPAuctionData | undefined {
  if (!data) return undefined;

  return {
    nextBidId: data[0],
    marginalPrice: data[1],
    minimumPrice: data[2],
    nextDecryptIndex: data[3],
    minFilled: data[4],
    minBidSize: data[5],
    status: data[6],
    marginalBidId: data[7],
    publicKey: data[8],
    privateKey: data[9],
  };
}

function mapFixedPriceData(
  data: readonly [bigint, bigint],
): FixedPriceAuctionData | undefined {
  return {
    price: data[0],
    maxPayoutPercentage: data[1],
  };
}
