import type { Auction, Curator, GetAuctionLots } from "@axis-finance/types";
import { useLaunchesQuery } from "@axis-finance/sdk/react";
import { getAuctionStatus } from "modules/auction/utils/get-auction-status";
import { sortAuction } from "modules/auction/utils/sort-auctions";
import { formatAuctionTokens } from "modules/auction/utils/format-tokens";
import { getAuctionType } from "modules/auction/utils/get-auction-type";
import {
  isPreviousBaselineAuction,
  isSecureAuction,
} from "modules/auction/utils/malicious-auction-filters";
import { getChainId } from "src/utils/chain";
import { useTokenLists } from "state/tokenlist";
import { useQueryAll } from "loaders/use-query-all";
import { useSafeRefetch } from "./use-safe-refetch";
import { externalAuctionInfo } from "modules/app/external-auction-info";
import { featureToggles } from "modules/app/feature-toggles";
import { useAuctionRegistrations } from "./use-auction-registrations";
import type { Address } from "viem";
import { allowedCurators } from "modules/app/curators";
import { environment } from "utils/environment";
import { useQueries } from "@tanstack/react-query";
import { fetchAuctionMetadata } from "loaders/use-missing-metadata";

export type AuctionsResult = {
  data: Auction[];
  refetch: () => void;
} & Pick<
  ReturnType<typeof useQueryAll>,
  "isSuccess" | "isLoading" | "isRefetching"
>;

export const getAuctionsQueryKey = (chainId: number) =>
  ["auctions", chainId] as const;

type UseAuctionsArgs = {
  curator?: string;
};

export function useAuctions({ curator }: UseAuctionsArgs = {}): AuctionsResult {
  const { data, isLoading, isSuccess, isRefetching } =
    useLaunchesQuery<GetAuctionLots>({
      queryKeyFn: getAuctionsQueryKey,
      isTestnet: environment.isTestnet,
    });

  // Refetch auctions if the cache is stale
  const refetch = useSafeRefetch(["auctions"]);
  const targetCurator = allowedCurators.find((c) => c.id === curator);

  const { activeRegistrations } = useAuctionRegistrations();

  const registrationLaunches = featureToggles.REGISTRATION_LAUNCHES
    ? activeRegistrations.data ?? []
    : [];

  // Filter out cancelled auctions
  const filteredAuctions = data.filter(
    (auction) => getAuctionStatus(auction) !== "cancelled",
  );

  const { getToken } = useTokenLists();

  const auctions = filteredAuctions
    .filter(
      (a) =>
        !curator ||
        (isCuratorAddress(a.curator as Address, targetCurator) &&
          (a.curatorApproved || isPreviousBaselineAuction(a))),
    )
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

  console.log({ auctions, data });
  // const acq = useQuery({
  //   queryKey: ["auction-metadata", filteredAuctions.length],
  //   queryFn: async () => fetchMissingMetadata(auctions),
  //   enabled: isSuccess,
  // });

  const queries = useQueries({
    queries: auctions.map((a) => ({
      queryKey: ["auction-metadata", a.id],
      queryFn: async () => fetchAuctionMetadata(a),
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
        errors: results.map((result) => result.error),
      };
    },
  });

  const auctionsWithFallbackData = queries.data;

  console.log({
    auctionsWithData: auctionsWithFallbackData,
    filteredAuctions,
    pending: queries.pending,
  });

  //console.log({ auctionsWithData, acq });

  //const noLinks = auctionsWithData?.filter((a) => !a.info.links);
  //console.log({ noLinks });
  return {
    data: (queries.pending ? auctions : auctionsWithFallbackData) as Auction[],
    isLoading,
    refetch,
    isRefetching,
    isSuccess,
  };
}

function isCuratorAddress(address: Address, curator?: Curator) {
  if (!curator || !address) return false;

  return Array.isArray(curator.address)
    ? curator.address.includes(address.toLowerCase() as Address)
    : curator.address.toLowerCase() === address.toLowerCase();
}
