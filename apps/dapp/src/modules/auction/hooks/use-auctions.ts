import {
  GetAuctionLotsDocument,
  GetAuctionLotsQuery,
} from "@repo/subgraph-client/src/generated";
import { getAuctionStatus } from "../utils/get-auction-status";
import { AuctionListed } from "@repo/types";
import { UseQueryResult, useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./use-auction-info";
import { getChainId } from "src/utils/chain";
import { sortAuction } from "modules/auction/utils/sort-auctions";
import { formatAuctionTokens } from "../utils/format-tokens";
import { useTokenLists } from "state/tokenlist";
import { multihashRegex } from "utils/ipfs";
import { useQueryAll } from "loaders/use-query-all";

export type AuctionsResult = {
  result: AuctionListed[];
} & Pick<
  UseQueryResult<GetAuctionLotsQuery, unknown>,
  "isLoading" | "isRefetching"
> &
  Pick<ReturnType<typeof useQueryAll>, "refetch">;

export function useAuctions(): AuctionsResult {
  const { data, refetch, isLoading, isSuccess, isRefetching } =
    useQueryAll<GetAuctionLotsQuery>({
      document: GetAuctionLotsDocument,
      field: "auctionLots",
    });

  const infos = useQuery({
    queryKey: ["all-auction-info"],
    enabled: isSuccess,
    queryFn: () => {
      return Promise.all(
        data
          ?.filter((auction) => multihashRegex.test(auction.created.infoHash))
          .map(async (auction) => {
            const auctionInfo = await getAuctionInfo(auction.created.infoHash);
            return { id: auction.id, auctionInfo };
          }) ?? [],
      );
    },
  });

  const { getToken } = useTokenLists();

  return {
    result: (data ?? [])
      .map((auction) => {
        const auctionInfo = infos.data?.find((info) => info.id === auction.id)
          ?.auctionInfo;

        return {
          ...auction,
          ...formatAuctionTokens(auction, getToken, auctionInfo),
          chainId: getChainId(auction.chain),
          status: getAuctionStatus(auction),
          auctionInfo,
        };
      })
      .sort(sortAuction),
    isLoading: isLoading, //|| infos.isLoading,
    refetch,
    isRefetching,
  };
}
