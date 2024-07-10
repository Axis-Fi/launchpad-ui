import {
  GetAuctionLotsDocument,
  GetAuctionLotsQuery,
} from "@repo/subgraph-client/src/generated";
import type { Address, Auction } from "@repo/types";
import { getAuctionStatus } from "modules/auction/utils/get-auction-status";
import { sortAuction } from "modules/auction/utils/sort-auctions";
import { formatAuctionTokens } from "modules/auction/utils/format-tokens";
import { getAuctionType } from "modules/auction/utils/get-auction-type";
import { isSecureAuction } from "modules/auction/utils/malicious-auction-filters";
import { getChainId } from "src/utils/chain";
import { useTokenLists } from "state/tokenlist";
import { useQueryAll } from "loaders/use-query-all";

export type AuctionsResult = {
  data: Auction[];
} & Pick<
  ReturnType<typeof useQueryAll>,
  "refetch" | "isSuccess" | "isLoading" | "isRefetching"
>;

/** Patched auction lots query that treats callbacks as Address
 *  simpler than casting it further down the line */
type GetAuctionLots = {
  batchAuctionLots: Array<
    GetAuctionLotsQuery["batchAuctionLots"][0] & {
      callbacks: Address;
    }
  >;
};

export const getAuctionsQueryKey = (chainId: number) =>
  ["auctions", chainId] as const;

export function useAuctions(): AuctionsResult {
  const { data, refetch, isLoading, isSuccess, isRefetching } =
    useQueryAll<GetAuctionLots>({
      document: GetAuctionLotsDocument,
      fields: ["batchAuctionLots"],
      queryKeyFn: (deployment) => getAuctionsQueryKey(deployment.chain.id),
    });

  const rawAuctions = [...data.batchAuctionLots].flat() ?? [];

  // Filter out cancelled batch auctions before querying additional data
  const filteredAuctions = rawAuctions.filter(
    (auction) => getAuctionStatus(auction) !== "cancelled",
  );

  const { getToken } = useTokenLists();

  const auctions = filteredAuctions
    .map((auction) => {
      const type = getAuctionType(auction.auctionType);
      if (!type) {
        throw new Error(`Type not found for auction ${auction.auctionType}`);
      }

      const chainId = getChainId(auction.chain);

      const preparedAuction = {
        ...auction,
        auctionType: type,
        ...formatAuctionTokens(auction, getToken),
        status: getAuctionStatus(auction),
        chainId,
      };

      return {
        ...preparedAuction,
        isSecure: isSecureAuction(preparedAuction),
      };
    })
    .sort(sortAuction);

  return {
    data: auctions,
    isLoading: isLoading, //|| infos.isLoading,
    refetch,
    isRefetching,
    isSuccess,
  };
}
