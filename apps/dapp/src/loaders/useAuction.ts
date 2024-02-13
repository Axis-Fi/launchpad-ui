import { useGetAuctionLotQuery } from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";
import { SubgraphAuctionWithEvents } from "./subgraphTypes";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";

export type AuctionResult = {
  result?: SubgraphAuctionWithEvents;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading, ...query } = useGetAuctionLotQuery({
    lotId: lotId || "",
  });

  const auction =
    !data || !data.auctionLots || data.auctionLots.length == 0
      ? undefined
      : data.auctionLots[0];

  // @ts-expect-error type not implemented
  if (!auction?.created.infoHash) {
    console.warn("Auction info hash not found. Using dummy.");
  }

  const { data: auctionInfo, ...infoQuery } = useQuery({
    enabled: !!auction,
    queryKey: ["auction-info", auction?.id],
    queryFn: () =>
      // @ts-expect-error type not implemented
      getAuctionInfo(
        auction?.created.infoHash ||
          "QmSKBCWL2qvCCruAeMpp8eRnrc58e6gPrZfDTQGrcxZLJQ",
      ), // TODO remove hard-coding
  });

  if (!auction) {
    return {
      result: undefined,
      isLoading: isLoading || infoQuery.isLoading,
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
