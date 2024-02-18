import { useGetAuctionLotQuery } from "@repo/subgraph-client";
import { getChainId, getAuctionStatusWithBids } from "./subgraphHelper";
import { Auction } from "src/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";
import { useReadContract } from "wagmi";
import { axisContracts } from "@repo/contracts";
import { Address, formatUnits } from "viem";

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading, ...query } = useGetAuctionLotQuery({
    lotId: lotId || "",
  });

  const auction =
    !data || !data.auctionLots || data.auctionLots.length == 0
      ? undefined
      : data.auctionLots[0];

  const enabled = !!auction && !!auction?.created.infoHash;
  const { data: auctionInfo, ...infoQuery } = useQuery({
    enabled,
    queryKey: ["auction-info", auction?.id],
    queryFn: () => getAuctionInfo(auction?.created.infoHash || ""),
  });

  //TODO: fix this
  const chainId = getChainId(auction?.chain ?? "blast-testnet");
  const axisAddresses = axisContracts.addresses[chainId];

  const auctionData = useReadContract({
    address: axisAddresses?.localSealedBidBatchAuction,
    abi: axisContracts?.abis.localSealedBidBatchAuction,
    functionName: "auctionData",
    args: [BigInt(auction?.lotId ?? 0)],
    query: { enabled: query.isSuccess },
  });

  if (!auction || data?.auctionLots.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading || infoQuery.isLoading || infoQuery.isPending,
      ...query,
    };
  }

  const status = getAuctionStatusWithBids(
    auction.start,
    auction.conclusion,
    auction.capacity,
    auction.settle !== null,
    auction.bids.length,
    auction.bidsDecrypted.length,
    auction.refundedBids.length,
  );

  return {
    result: {
      ...auction,
      ...parseAuctionData(
        auctionData.data!,
        Number(auction.baseToken.decimals),
      ),
      chainId,
      status,
      auctionInfo,
    },
    isLoading: isLoading || infoQuery.isLoading,
  };
}

//https://github.com/Axis-Fi/moonraker/blob/4172793566beb2b06113c8775b080c90a7a52853/src/modules/auctions/LSBBA/LSBBA.sol#L90
//TODO: cleanup
function parseAuctionData(
  data: readonly [number, bigint, bigint, bigint, bigint, bigint, Address],
  decimals: number,
) {
  if (!data) return {};
  const minPrice = formatUnits(data[3], decimals);
  const minBidSize = formatUnits(data[5], decimals);

  return { minPrice, minBidSize };
}
