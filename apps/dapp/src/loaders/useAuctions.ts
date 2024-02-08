import { useGetAuctionsQuery } from "@repo/subgraph-client";
import { Auction } from "src/types";
import { getChainId, getStatus } from "./subgraphHelper";

export type AuctionsResult = {
  result: Auction[];
  isLoading: boolean;
};

export function useAuctions(): AuctionsResult {
  const { data, isLoading } = useGetAuctionsQuery();

  return {
    result: (data?.auctionCreateds ?? []).map((auction) => ({
      ...auction,
      chainId: getChainId(auction.chain),
      status: getStatus(auction.start, auction.conclusion, auction.capacity),
    })),
    isLoading: isLoading,
  };
}
