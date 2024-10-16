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

  const registrationLaunches = featureToggles.REGISTRATION_LAUNCHES
    ? activeRegistrations.data ?? []
    : [];

  const rawAuctions = data.batchAuctionLots.flat() ?? [];

  // Filter out cancelled auctions
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

        // Handle external auction data
        info: auction.info ?? externalAuctionInfo[auction.id] ?? null,
      };

      return {
        ...preparedAuction,
        isSecure: isSecureAuction(preparedAuction),
      } as Auction;
    })
    .concat(registrationLaunches)
    .sort(sortAuction);

  return {
    data: auctions as Auction[],
    isLoading,
    refetch,
    isRefetching,
    isSuccess,
  };
}
