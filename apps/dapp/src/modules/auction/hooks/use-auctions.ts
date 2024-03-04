import {
  GetAuctionLotsQuery,
  useGetAuctionLotsQuery,
} from "@repo/subgraph-client/src/generated";
import { getAuctionStatus } from "../utils/get-auction-status";
import { AuctionListed } from "@repo/types";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./use-auction-info";
import { getChainId } from "src/utils/chain";
import { sortAuction } from "modules/auction/utils/sort-auctions";
import { parseToken } from "./use-auction";

export type AuctionsResult = {
  result: AuctionListed[];
} & Pick<
  UseQueryResult<GetAuctionLotsQuery, unknown>,
  "isLoading" | "refetch" | "isRefetching"
>;

export function useAuctions(): AuctionsResult {
  const { data, refetch, isLoading, isSuccess, isRefetching } =
    useGetAuctionLotsQuery();

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
    result: (data?.auctionLots ?? [])
      .map((auction) => ({
        ...auction,
        baseToken: parseToken(auction.baseToken, getChainId(auction.chain)),
        quoteToken: parseToken(auction.quoteToken, getChainId(auction.chain)),
        chainId: getChainId(auction.chain),
        status: getAuctionStatus(auction),
        auctionInfo: infos.data?.find((info) => info.id === auction.id)
          ?.auctionInfo,
      }))
      .sort(sortAuction),
    isLoading: isLoading, //|| infos.isLoading,
    refetch,
    isRefetching,
  };
}
