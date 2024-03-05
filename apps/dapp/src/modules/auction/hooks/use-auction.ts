import { useGetAuctionLotQuery } from "@repo/subgraph-client/src/generated";
import { getAuctionStatus } from "../utils/get-auction-status";
import {
  Auction,
  AuctionData,
  RawSubgraphAuctionWithEvents,
} from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./use-auction-info";
import { formatUnits } from "viem";
import { formatDate } from "@repo/ui";
import { formatDistanceToNow } from "date-fns";
import { trimCurrency } from "utils";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { useTokenLists } from "state/tokenlist";
import { formatAuctionTokens } from "../utils/format-tokens";

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: ReturnType<typeof useGetAuctionLotQuery>["refetch"];
};

export function useAuction(lotId?: string, chainId?: number): AuctionResult {
  const { getToken } = useTokenLists();

  const { data, refetch, isLoading, isRefetching } = useGetAuctionLotQuery({
    lotId: lotId || "",
  });

  const rawAuction =
    !data || !data.auctionLots || data.auctionLots.length == 0
      ? undefined
      : data.auctionLots[0];

  const enabled = !!rawAuction && !!rawAuction?.created.infoHash;

  const { data: auctionInfo } = useQuery({
    enabled,
    queryKey: ["auction-info", rawAuction?.id, rawAuction?.created.infoHash],
    queryFn: () => getAuctionInfo(rawAuction?.created.infoHash || ""),
  });

  const { data: auctionData } = useAuctionData({ chainId, lotId });

  if (!rawAuction || !chainId || data?.auctionLots.length === 0) {
    return {
      refetch,
      isRefetching,
      result: undefined,
      isLoading: isLoading, //|| infoQuery.isLoading, //|| infoQuery.isPending,
    };
  }

  const status = getAuctionStatus(rawAuction);

  const auction = {
    ...rawAuction,
    chainId,
    status,
    auctionInfo,
  };

  const tokens = formatAuctionTokens(auction, getToken, auctionInfo);

  return {
    refetch,
    result: {
      ...auction,
      ...tokens,
      auctionData,
      formatted: formatAuction(auction, auctionData),
    },
    isLoading: isLoading, //|| infoQuery.isLoading,
    isRefetching,
  };
}

/** Formats Auction information for displaying purporses */
export function formatAuction(
  auction: RawSubgraphAuctionWithEvents,
  auctionData?: AuctionData,
) {
  const startDate = new Date(Number(auction.start) * 1000);
  const endDate = new Date(Number(auction.conclusion) * 1000);

  const startFormatted = formatDate.fullLocal(startDate);
  const endFormatted = formatDate.fullLocal(endDate);
  const startDistance = formatDistanceToNow(startDate);
  const endDistance = formatDistanceToNow(endDate);
  const totalBidAmount = auction.bids.reduce(
    (total, b) => total + Number(b.amountIn),
    0,
  );

  const totalBidsDecrypted = auction.bids.filter(
    (b) => b.status === "decrypted",
  ).length;

  const tokenAmounts = auction.bids
    .filter((b) => Number(b.amountOut) > 0)
    .reduce(
      (total, b) => {
        total.in += Number(b.amountIn);
        total.out += Number(b.amountOut);
        return total;
      },
      { in: 0, out: 0 },
    );

  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;

  const rate = trimCurrency((tokenAmounts.in / tokenAmounts.out).toString());

  return {
    startDate,
    endDate,
    startFormatted,
    endFormatted,
    startDistance,
    endDistance,
    totalBids: auction.bids.length,
    totalBidsDecrypted,
    totalBidAmount,
    tokenAmounts,
    uniqueBidders,
    rate,
    minPrice: formatUnits(
      auctionData?.minimumPrice ?? 0n,
      Number(auction.quoteToken.decimals),
    ),
    minBidSize: formatUnits(
      auctionData?.minBidSize ?? 0n,
      Number(auction.baseToken.decimals), //TODO: validate if its the right token
    ),
  };
}
