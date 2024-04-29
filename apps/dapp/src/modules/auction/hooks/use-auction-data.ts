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
  const auctionType = type as keyof AxisContractAddresses;

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
        number,
        bigint,
        boolean,
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
    proceedsClaimed: data[4],
    marginalPrice: data[5],
    minimumPrice: data[6],
    minFilled: data[7],
    minBidSize: data[8],
    publicKey: data[9],
    privateKey: data[10],
    bidIds: data[11],
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
