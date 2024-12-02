import type { Auction, Curator, GetAuctionLots } from "@repo/types";
import { useLaunches } from "@repo/sdk/react";
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
import {
  allowedCurators,
  externalAuctionInfo,
  featureToggles,
} from "@repo/env";
import { useAuctionRegistrations } from "./use-auction-registrations";
import { Address } from "viem";

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
    useLaunches<GetAuctionLots>({
      queryKeyFn: getAuctionsQueryKey,
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

  return {
    data: auctions as Auction[],
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
