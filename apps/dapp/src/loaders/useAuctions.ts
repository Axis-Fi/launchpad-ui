import { useGetAuctionsQuery } from "@repo/subgraph-client";
import { Auction } from "src/types";
import { getChainId } from "./subgraphHelper";

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
      status: "created", // TODO determine status
    })),
    isLoading: isLoading,
  };
}
