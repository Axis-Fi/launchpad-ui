import {
  GetAuctionLotsDocument,
  GetAuctionLotsQuery,
} from "@repo/subgraph-client/src/generated";
import { Auction } from "@repo/types";
import { getAuctionStatus } from "../utils/get-auction-status";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./use-auction-info";
import { getChainId } from "src/utils/chain";
import { sortAuction } from "modules/auction/utils/sort-auctions";
import { formatAuctionTokens } from "../utils/format-tokens";
import { useTokenLists } from "state/tokenlist";
import { multihashRegex } from "utils/ipfs";
import { useQueryAll } from "loaders/use-query-all";
import { getAuctionType } from "../utils/get-auction-type";

export type AuctionsResult = {
  result: Auction[];
  getAuctionById: (id: string) => Auction | undefined;
} & Pick<
  ReturnType<typeof useQueryAll>,
  "refetch" | "isSuccess" | "isLoading" | "isRefetching"
>;

export function useAuctions(): AuctionsResult {
  const { data, refetch, isLoading, isSuccess, isRefetching } =
    useQueryAll<GetAuctionLotsQuery>({
      document: GetAuctionLotsDocument,
      fields: ["batchAuctionLots", "atomicAuctionLots"],
    });

  const rawAuctions = [
    ...data.atomicAuctionLots,
    ...data.batchAuctionLots,
  ].flat();

  const { getToken } = useTokenLists();

  const infos = useQuery({
    queryKey: ["all-auction-info"],
    enabled: isSuccess,
    queryFn: () => {
      return Promise.all(
        rawAuctions
          ?.filter((auction) => multihashRegex.test(auction.created.infoHash))
          .map(async (auction) => {
            const auctionInfo = await getAuctionInfo(auction.created.infoHash);
            return { id: auction.id, auctionInfo };
          }) ?? [],
      );
    },
  });

  const auctions = (rawAuctions ?? [])
    .map((auction) => {
      const auctionInfo = infos.data?.find((info) => info.id === auction.id)
        ?.auctionInfo;
      const type = getAuctionType(auction.auctionType);
      if (!type) {
        throw new Error(`Type not found for auction ${auction.auctionType}`);
      }
      return {
        ...auction,
        auctionType: type,
        ...formatAuctionTokens(auction, getToken, auctionInfo),
        chainId: getChainId(auction.chain),
        status: getAuctionStatus(auction),
        auctionInfo,
      };
    })
    .sort(sortAuction);

  const getAuctionById = (id: string) => {
    return auctions.find((a) => a.id === id);
  };

  return {
    result: auctions,
    getAuctionById,
    isLoading: isLoading, //|| infos.isLoading,
    refetch,
    isRefetching,
    isSuccess,
  };
}
