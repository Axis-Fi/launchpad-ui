import {
  GetAuctionLotQuery,
  useGetAuctionLotQuery,
} from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuctionWithEvents } from "./subgraphTypes";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";

export type AuctionResult = {
  result?: SubgraphAuctionWithEvents;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading, ...query } = useGetAuctionLotQuery(
    { lotId: lotId || "" },
    { placeholderData: {} as GetAuctionLotQuery },
  );

  const auction = data?.auctionLots[0];

  const { data: auctionInfo, ...infoQuery } = useQuery({
    enabled: !!auction,
    queryKey: ["auction-info", auction?.id],
    queryFn: () =>
      getAuctionInfo("QmSKBCWL2qvCCruAeMpp8eRnrc58e6gPrZfDTQGrcxZLJQ"), // TODO remove hard-coding
    // @ts-expect-error type not implemented
    // queryFn: () => getAuctionInfo(auction.created.infoHash),
  });

  if (!auction || data.auctionLots.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading, // TODO should this not consider auction-info status?
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
