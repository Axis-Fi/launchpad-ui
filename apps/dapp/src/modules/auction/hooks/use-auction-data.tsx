import { axisContracts } from "@repo/contracts";
import { Auction, AuctionData } from "src/types";
import { parseUnits } from "viem";
import { useReadContract } from "wagmi";

export function useAuctionData(auction?: Auction) {
  const auctionDataQuery = useReadContract({
    abi: axisContracts.abis.localSealedBidBatchAuction,
    address: !auction
      ? undefined
      : axisContracts.addresses[auction.chainId].localSealedBidBatchAuction,
    functionName: "auctionData",
    args: [parseUnits(auction?.lotId ?? "0", 0)],
    query: { enabled: !!auction },
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
