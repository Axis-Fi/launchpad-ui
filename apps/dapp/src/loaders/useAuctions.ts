import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuctionWithEvents } from "./subgraphTypes";

export type AuctionsResult = {
  result: SubgraphAuctionWithEvents[];
  isLoading: boolean;
};

export function useAuctions(): AuctionsResult {
  const { data, isLoading } = useGetAuctionLotsQuery();

  return {
    //@ts-expect-error -> TODO: validate type
    result: (data?.auctionLots ?? []).map((auction) => ({
      ...auction,
      chainId: getChainId(auction.chain),
      status: getStatus(auction.start, auction.conclusion, auction.capacity),
    })),
    isLoading: isLoading,
  };
}
