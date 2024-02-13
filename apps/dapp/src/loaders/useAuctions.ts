import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuctionWithEvents } from "./subgraphTypes";
import { useQuery } from "@tanstack/react-query";
import { getData } from "./ipfs";

export type AuctionsResult = {
  result: SubgraphAuctionWithEvents[];
  isLoading: boolean;
};

export function useAuctions(): AuctionsResult {
  const { data, isLoading, isSuccess } = useGetAuctionLotsQuery();

  const infos = useQuery({
    queryKey: ["all-auction-info"],
    enabled: isSuccess,
    queryFn: () => {
      return Promise.all(
        data?.auctionLots.map(async (auction) => {
          //@ts-expect-error type not implemented
          const auctionInfo = await getData(auction.created.infoHash);
          return { id: auction.id, auctionInfo };
        }) ?? [],
      );
    },
  });

  return {
    //@ts-expect-error -> TODO: validate type
    result: (data?.auctionLots ?? []).map((auction) => ({
      ...auction,
      chainId: getChainId(auction.chain),
      status: getStatus(auction.start, auction.conclusion, auction.capacity),
      auctionInfo: infos.data?.find((info) => info.id === auction.id),
    })),
    isLoading: isLoading,
  };
}
