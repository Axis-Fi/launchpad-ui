import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuction } from "./subgraphTypes";

export type AuctionsResult = {
  result: SubgraphAuction[];
  isLoading: boolean;
};

export function useAuctions(): AuctionsResult {
  const { data, isLoading } = useGetAuctionLotsQuery();

  return {
    result: (data?.auctionLots ?? []).map((auction) => ({
      ...auction,
      chainId: getChainId(auction.chain),
      status: getStatus(auction.start, auction.conclusion, auction.capacity),
    })),
    isLoading: isLoading,
  };
}
