import { GetAuctionLotsDocument } from "@repo/subgraph-client/src/generated";
import type { Auction, GetAuctionLots } from "@repo/types";
import { getAuctionStatus } from "modules/auction/utils/get-auction-status";
import { sortAuction } from "modules/auction/utils/sort-auctions";
import { formatAuctionTokens } from "modules/auction/utils/format-tokens";
import { getAuctionType } from "modules/auction/utils/get-auction-type";
import { isSecureAuction } from "modules/auction/utils/malicious-auction-filters";
import { getChainId } from "src/utils/chain";
import { useTokenLists } from "state/tokenlist";
import { useQueryAll } from "loaders/use-query-all";
import { useSafeRefetch } from "./use-safe-refetch";
import { externalAuctionInfo, featureToggles } from "@repo/env";
import { useAuctionRegistrations } from "./use-auction-registrations";

export type AuctionsResult = {
  data: Auction[];
  refetch: () => void;
} & Pick<
  ReturnType<typeof useQueryAll>,
  "isSuccess" | "isLoading" | "isRefetching"
>;

export const getAuctionsQueryKey = (chainId: number) =>
  ["auctions", chainId] as const;

export function useAuctions(): AuctionsResult {
  const { data, isLoading, isSuccess, isRefetching } =
    useQueryAll<GetAuctionLots>({
      document: GetAuctionLotsDocument,
      fields: ["batchAuctionLots"],
      queryKeyFn: (deployment) => getAuctionsQueryKey(deployment.chain.id),
    });

  // Refetch auctions if the cache is stale
  const refetch = useSafeRefetch(["auctions"]);

  const { activeRegistrations } = useAuctionRegistrations();
  const maybeRegistrationLaunches = featureToggles.REGISTRATION_LAUNCHES
    ? activeRegistrations.data ?? []
    : [];

  const rawAuctions =
    [...data.batchAuctionLots, ...maybeRegistrationLaunches].flat() ?? [];

  // Add external data to auctions before processing
  const augmentedAuctions = rawAuctions
    .filter((x) => x != null)
    .map((auction) => ({
      ...auction,
      info:
        auction?.info && auction?.id ? externalAuctionInfo[auction.id] : null,
    }));

  // Filter out cancelled batch auctions before querying additional data
  const filteredAuctions = augmentedAuctions.filter(
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
    data: auctions as Auction[],
    isLoading,
    refetch,
    isRefetching,
    isSuccess,
  };
}
