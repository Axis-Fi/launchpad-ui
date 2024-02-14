import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuction } from "./subgraphTypes";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";

export type AuctionsResult = {
  result: SubgraphAuction[];
  isLoading: boolean;
};

export function useAuctions(): AuctionsResult {
  const { data, isLoading, isSuccess } = useGetAuctionLotsQuery();

  const infos = useQuery({
    queryKey: ["all-auction-info"],
    enabled: isSuccess,
    queryFn: () => {
      return Promise.all(
        data?.auctionLots
          //.filter((a) => a.created?.infoHash)
          .map(async (auction) => {
            const auctionInfo = await getAuctionInfo(auction.created.infoHash);
            return { id: auction.id, auctionInfo };
          }) ?? [],
      );
    },
  });

  return {
    result: (data?.auctionLots ?? []).map((auction) => ({
      ...auction,
      chainId: getChainId(auction.chain),
      status: getStatus(auction.start, auction.conclusion, auction.capacity),
      auctionInfo: infos.data?.find((info) => info.id === auction.id)
        ?.auctionInfo,
    })),
    isLoading: isLoading,
  };
}
