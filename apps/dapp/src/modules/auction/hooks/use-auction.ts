import {
  GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client/src/generated";
import {
  type QueryKey,
  type RefetchOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { getAuctionStatus } from "modules/auction/utils/get-auction-status";
import { AuctionType } from "@repo/types";
import type {
  Auction,
  EMPAuctionData,
  AuctionFormattedInfo,
  BatchSubgraphAuction,
  FixedPriceBatchAuctionData,
  EMPFormattedInfo,
  FPBFormattedInfo,
  AuctionId,
} from "@repo/types";
import { formatUnits } from "viem";
import { formatDate } from "@repo/ui";
import { formatDistanceToNow } from "date-fns";
import { trimCurrency } from "utils";
import {
  useAuctionData,
  type UseAuctionDataReturn,
} from "modules/auction/hooks/use-auction-data";
import { useTokenLists } from "state/tokenlist";
import { formatAuctionTokens } from "../utils/format-tokens";
import { deployments } from "@repo/deployments";
import { fetchParams } from "utils/fetch";
import { parseAuctionId } from "modules/auction/utils/parse-auction-id";
import { isSecureAuction } from "modules/auction/utils/malicious-auction-filters";
import { useIsCacheStale } from "./use-is-cache-stale";
import { useSafeRefetch } from "./use-safe-refetch";

type AuctionQueryKey = QueryKey &
  readonly ["getBatchAuctionLot", { id: AuctionId }];

export type AuctionResult = {
  result?: Auction;
  queryKey: AuctionQueryKey;
  refetch: (
    auctionDataOptions?: RefetchOptions,
  ) => Promise<
    [Awaited<ReturnType<UseAuctionDataReturn["refetch"]>>, Awaited<void>]
  >;
} & Pick<
  ReturnType<typeof useGetBatchAuctionLotQuery>,
  "isLoading" | "isRefetching"
>;

export const getAuctionQueryKey = (auctionId: AuctionId) =>
  ["getBatchAuctionLot", { id: auctionId }] as const;

export function useAuction(
  id: string,
  auctionType: AuctionType,
): AuctionResult {
  const { getToken } = useTokenLists();
  const { chainId, lotId } = parseAuctionId(id);

  const queryKey = [
    "getBatchAuctionLot",
    { id } as { id: AuctionId },
  ] satisfies AuctionQueryKey;

  // Don't fetch the auction if an optimistic update (e.g. a bid) is still fresh.
  // This allows the subgraph time to update before refetching.
  const isCacheStale = useIsCacheStale(queryKey);
  const isQueryEnabled = !!chainId && !!id && isCacheStale;

  const {
    data,
    isLoading,
    isRefetching,
  }: UseQueryResult<GetBatchAuctionLotQuery> = useGetBatchAuctionLotQuery(
    {
      endpoint: deployments[chainId!].subgraphURL,
      fetchParams,
    },
    { id: id! },
    { enabled: isQueryEnabled },
  );

  const refetchAuction = useSafeRefetch(queryKey);

  const rawAuction: GetBatchAuctionLotQuery["batchAuctionLot"] = (
    data as GetBatchAuctionLotQuery
  )?.batchAuctionLot;

  const {
    data: auctionData,
    refetch: refetchAuctionData,
    isLoading: isAuctionDataLoading,
  } = useAuctionData({
    chainId,
    lotId,
    type: auctionType,
  });

  /**
   * Redefine refetch of an auction to include its dependencies that also update (such as auctionData)
   */
  const refetch = async (
    auctionDataOptions?: RefetchOptions,
  ): Promise<
    [Awaited<ReturnType<UseAuctionDataReturn["refetch"]>>, Awaited<void>]
  > => {
    return Promise.all([
      refetchAuctionData(auctionDataOptions),
      refetchAuction(),
    ]);
  };

  if (!rawAuction || !auctionData) {
    return {
      refetch,
      isRefetching,
      result: undefined,
      isLoading: isLoading || isAuctionDataLoading,
      queryKey,
    };
  }

  // Check that the rawAuction has a callback in the format of 0x...
  if (!rawAuction.callbacks.match(/^0x[0-9a-fA-F]{40}$/)) {
    throw new Error(`Invalid callback address: ${rawAuction.callbacks}`);
  }

  const status = getAuctionStatus(rawAuction);

  const auction = {
    ...rawAuction,
    chainId,
    status,
  };

  const tokens = formatAuctionTokens(auction, getToken);

  if (!auctionType) {
    throw new Error(`Auction type ${auctionType} doesn't exist`);
  }

  const formatted = formatAuction(auction, auctionType, auctionData);
  const preparedAuction = {
    ...auction,
    bids: auction.bids.sort((a, b) => +b.blockTimestamp - +a.blockTimestamp), //Sort by time descending
    ...tokens,
    auctionData,
    auctionType,
    formatted,
    callbacks: auction.callbacks as `0x${string}`, // Has been checked above
  };

  return {
    refetch,
    result: {
      ...preparedAuction,
      isSecure: isSecureAuction(preparedAuction),
    },
    isLoading: isLoading, //|| infoQuery.isLoading,
    isRefetching,
    queryKey,
  };
}

/** Formats Auction information for displaying purposes */
export function formatAuction(
  auction: BatchSubgraphAuction,
  auctionType: AuctionType,
  auctionData?: EMPAuctionData | FixedPriceBatchAuctionData,
): AuctionFormattedInfo {
  if (!auction) throw new Error("No Auction provided to formatAuction");

  const startDate = new Date(Number(auction.start) * 1000);
  const endDate = new Date(Number(auction.conclusion) * 1000);

  const startFormatted = formatDate.fullLocal(startDate);
  const endFormatted = formatDate.fullLocal(endDate);
  const startDistance = formatDistanceToNow(startDate);
  const endDistance = formatDistanceToNow(endDate);

  let moduleFields;
  if (auctionType === AuctionType.SEALED_BID) {
    moduleFields = addEMPFields(auctionData as EMPAuctionData, auction);
  } else if (auctionType === AuctionType.FIXED_PRICE_BATCH) {
    moduleFields = addFPBFields(auction);
  }

  return {
    startDate,
    endDate,
    startFormatted,
    endFormatted,
    startDistance,
    endDistance,
    sold: trimCurrency(auction.sold),
    purchased: trimCurrency(auction.purchased),
    purchasedDecimal: Number(auction.purchased),
    capacity: trimCurrency(auction.capacity),
    totalSupply: trimCurrency(
      formatUnits(
        BigInt(auction.baseToken.totalSupply),
        Number(auction.baseToken.decimals),
      ),
    ),
    tokenPairSymbols: `${auction.quoteToken.symbol}/${auction.baseToken.symbol}`,
    ...moduleFields,
  };
}

/** The value returned as marginal price when auction couldnt be cleared */
const UNCLEARED_MARGINAL_PRICE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;

function addEMPFields(
  auctionData: EMPAuctionData,
  auction: BatchSubgraphAuction,
): EMPFormattedInfo {
  const minPrice = formatUnits(
    auctionData?.minimumPrice ?? 0n,
    Number(auction.quoteToken.decimals),
  );

  const minBidSize = formatUnits(
    auctionData?.minBidSize ?? 0n,
    Number(auction.quoteToken.decimals),
  );

  const marginalPrice = formatUnits(
    auctionData?.marginalPrice ?? "",
    Number(auction.quoteToken.decimals),
  );
  const totalBidsDecrypted = auction.bids.filter(
    (b) => b.status === "decrypted",
  ).length;
  const totalBidsClaimed = auction.bids.filter(
    (b) => b.status === "claimed",
  ).length;

  const totalBidAmount = auction.bids.reduce(
    (total, b) => total + Number(b.amountIn),
    0,
  );

  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;

  const cleared = auctionData?.marginalPrice !== UNCLEARED_MARGINAL_PRICE;

  // TODO return these as numbers and format them in the UI
  return {
    cleared,
    marginalPrice: trimCurrency(marginalPrice),
    marginalPriceDecimal: Number(marginalPrice),
    rate: trimCurrency(marginalPrice),
    minPrice: trimCurrency(minPrice),
    minBidSize: trimCurrency(minBidSize),
    minFilled: trimCurrency(auction.encryptedMarginalPrice!.minFilled!),
    totalBidAmountFormatted: trimCurrency(totalBidAmount),
    totalBidAmountDecimal: totalBidAmount,
    totalBids: auction.bids.length,
    totalBidsDecrypted,
    totalBidsClaimed,
    uniqueBidders,
  };
}

function addFPBFields(auction: BatchSubgraphAuction): FPBFormattedInfo {
  const totalBids = auction.bids.length;
  const totalBidsClaimed = auction.bids.filter(
    (b) => b.status === "claimed",
  ).length;
  const totalBidAmount = auction.bids.reduce(
    (total, b) => total + Number(b.amountIn),
    0,
  );
  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;
  const cleared = auction.fixedPrice?.settlementSuccessful || false;
  const minFilled = auction.fixedPrice?.minFilled
    ? trimCurrency(auction.fixedPrice?.minFilled)
    : "";
  const price = auction.fixedPrice?.price || "";

  // TODO return these as numbers and format them in the UI
  return {
    price: price,
    totalBids,
    totalBidsClaimed,
    totalBidAmountFormatted: trimCurrency(totalBidAmount),
    totalBidAmountDecimal: totalBidAmount,
    uniqueBidders,
    cleared,
    minFilled,
  };
}
