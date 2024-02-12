import {
  GetAuctionLotsQuery,
  useGetAuctionLotsQuery,
} from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";

type RawAuctionResult = GetAuctionLotsQuery["auctionLots"][0];

type RawAuctionWithEventsResult = {
  chainId: number;
  status: string;
} & RawAuctionResult;

export type AuctionsResult = {
  result: RawAuctionWithEventsResult[];
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
