import { useGetAuctionLotQuery } from "@repo/subgraph-client";
import { getAuctionStatus } from "../modules/auction/utils/get-auction-status";
import { Auction, AuctionData } from "src/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";
import { formatUnits } from "viem";
import { formatDate } from "@repo/ui";
import { formatDistanceToNow } from "date-fns";
import { trimCurrency } from "src/utils/currency";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { getChainId } from "src/utils/chain";

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
  refetch: ReturnType<typeof useGetAuctionLotQuery>["refetch"];
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, refetch, isLoading } = useGetAuctionLotQuery({
    lotId: lotId || "",
  });

  const auction =
    !data || !data.auctionLots || data.auctionLots.length == 0
      ? undefined
      : data.auctionLots[0];

  const enabled = !!auction && !!auction?.created.infoHash;

  const { data: auctionInfo } = useQuery({
    enabled,
    queryKey: ["auction-info", auction?.id, auction?.created.infoHash],
    queryFn: () => getAuctionInfo(auction?.created.infoHash || ""),
  });

  const auctionData = useAuctionData();

  if (!auction || data?.auctionLots.length === 0) {
    return {
      refetch: refetch,
      result: undefined,
      isLoading: isLoading, //|| infoQuery.isLoading, //|| infoQuery.isPending,
    };
  }

  const chainId = getChainId(auction?.chain);
  const status = getAuctionStatus(auction);

  const result = {
    ...auction,
    chainId,
    status,
    auctionInfo,
  };

  return {
    refetch,
    result: {
      ...result,
      formatted: formatAuction(result, auctionData.data),
    },
    isLoading: isLoading, //|| infoQuery.isLoading,
  };
}

/** Formats Auction information for displaying purporses */
export function formatAuction(auction: Auction, auctionData?: AuctionData) {
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
