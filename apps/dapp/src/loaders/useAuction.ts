import {
  GetAuctionLotQuery,
  useGetAuctionLotQuery,
} from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuctionWithEvents } from "./subgraphTypes";
import { useQuery } from "@tanstack/react-query";
import { getData } from "./ipfs";

export type AuctionResult = {
  result?: SubgraphAuctionWithEvents;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading, ...query } = useGetAuctionLotQuery(
    { lotId: lotId || "" },
    { placeholderData: {} as GetAuctionLotQuery },
  );

  const [auction] = data?.auctionLots ?? [];

  const enabled = !!auction && !!auction?.created?.infoHash;
  const { data: auctionInfo, ...infoQuery } = useQuery({
    enabled,
    queryKey: ["auction-info", auction?.id],
    //@ts-expect-error type not implemented
    queryFn: () => getData(auction.created?.infoHash),
  });

  if (!auction || data?.auctionLots.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading || infoQuery.isLoading || infoQuery.isPending,
      ...query,
    };
  }

  return {
    result: {
      ...auction,
      chainId: getChainId(auction.chain),
      status: getStatus(auction.start, auction.conclusion, auction.capacity),
      auctionInfo,
    },
    isLoading: isLoading || infoQuery.isLoading,
  };
}
