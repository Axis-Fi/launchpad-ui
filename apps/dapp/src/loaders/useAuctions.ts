import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getChainId, getAuctionStatusWithBids } from "./subgraphHelper";
import { Auction } from "src/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";

export type AuctionsResult = {
  result: Auction[];
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
    //@ts-expect-error //TODO: update queries
    result: (data?.auctionLots ?? []).map((auction) => ({
      ...auction,
      chainId: getChainId(auction.chain),
      status: getAuctionStatusWithBids(
        auction.start,
        auction.conclusion,
        auction.capacity,
        !!auction.settle,
        auction.bids.length,
        auction.bidsDecrypted.length,
        auction.refundedBids.length,
      ),
      auctionInfo: infos.data?.find((info) => info.id === auction.id)
        ?.auctionInfo,
    })),
    isLoading: isLoading || infos.isLoading,
  };
}
