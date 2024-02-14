import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getChainId, getAuctionStatus } from "./subgraphHelper";
import { SubgraphAuction } from "./subgraphTypes";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";

export type AuctionsResult = {
  result: SubgraphAuction[];
  isLoading: boolean;
};

export function useAuctions(): AuctionsResult {
  const { data, isLoading, isSuccess } = useGetAuctionLotsQuery();

  // TODO can't check if auction is concluded or decrypted here since the bids aren't available on this query. Consider adding events to the auction query (though the query results may become too large)

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
      status: getAuctionStatus(
        auction.start,
        auction.conclusion,
        auction.capacity,
      ),
      auctionInfo: infos.data?.find((info) => info.id === auction.id)
        ?.auctionInfo,
    })),
    isLoading: isLoading,
  };
}
