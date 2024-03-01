import { useGetAuctionLotsQuery } from "@repo/subgraph-client";
import { getAuctionStatus } from "../modules/auction/utils/get-auction-status";
import { Auction } from "src/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";
import { getChainId } from "src/utils/chain";
import { sortAuction } from "modules/auction/utils/sort-auctions";

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
        data?.auctionLots.map(async (auction) => {
          const auctionInfo = await getAuctionInfo(auction.created.infoHash);
          return { id: auction.id, auctionInfo };
        }) ?? [],
      );
    },
  });

  return {
    //@ts-expect-error //TODO: update queries
    result: (data?.auctionLots ?? [])
      .map((auction) => ({
        ...auction,
        chainId: getChainId(auction.chain),
        //@ts-expect-error //TODO: update queries
        status: getAuctionStatus(auction),
        auctionInfo: infos.data?.find((info) => info.id === auction.id)
          ?.auctionInfo,
      }))
      //@ts-expect-error //TODO: update queries
      .sort(sortAuction),
    isLoading: isLoading, //|| infos.isLoading,
  };
}
