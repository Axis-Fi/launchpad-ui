import { useGetAuctionLotQuery } from "@repo/subgraph-client";
import { getChainId, getAuctionStatusWithBids } from "./subgraphHelper";
import { Auction } from "src/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./useAuctionInfo";
import { useReadContract } from "wagmi";
import { axisContracts } from "@repo/contracts";
import { Address, formatUnits } from "viem";
import { formatDate } from "@repo/ui";
import { formatDistanceToNow } from "date-fns";
import { trimCurrency } from "src/utils/currency";

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading, ...query } = useGetAuctionLotQuery({
    lotId: lotId || "",
  });

  const auction =
    !data || !data.auctionLots || data.auctionLots.length == 0
      ? undefined
      : data.auctionLots[0];

  const enabled = !!auction && !!auction?.created.infoHash;
  const { data: auctionInfo, ...infoQuery } = useQuery({
    enabled,
    queryKey: ["auction-info", auction?.id],
    queryFn: () => getAuctionInfo(auction?.created.infoHash || ""),
  });

  //TODO: fix this
  const chainId = getChainId(auction?.chain ?? "blast-testnet");
  const axisAddresses = axisContracts.addresses[chainId];

  const auctionData = useReadContract({
    address: axisAddresses?.localSealedBidBatchAuction,
    abi: axisContracts?.abis.localSealedBidBatchAuction,
    functionName: "auctionData",
    args: [BigInt(auction?.lotId ?? 0)],
    query: { enabled: query.isSuccess },
  });

  if (!auction || data?.auctionLots.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading || infoQuery.isLoading || infoQuery.isPending,
      ...query,
    };
  }

  const status = getAuctionStatusWithBids(
    auction.start,
    auction.conclusion,
    auction.capacity,
    auction.settle !== null,
    auction.bids.length,
    auction.bidsDecrypted.length,
    auction.refundedBids.length,
  );

  const result = {
    ...auction,
    ...parseAuctionData(auctionData.data!, Number(auction.baseToken.decimals)),
    chainId,
    status,
    auctionInfo,
  };

  return {
    result: {
      ...result,
      formatted: formatAuction(result),
    },
    isLoading: isLoading || infoQuery.isLoading,
  };
}

//https://github.com/Axis-Fi/moonraker/blob/4172793566beb2b06113c8775b080c90a7a52853/src/modules/auctions/LSBBA/LSBBA.sol#L90
//TODO: cleanup
function parseAuctionData(
  data: readonly [number, bigint, bigint, bigint, bigint, bigint, Address],
  decimals: number,
) {
  if (!data) return { minPrice: "0", minBidSize: "0" };

  const minPrice = formatUnits(data[3], decimals);
  const minBidSize = formatUnits(data[5], decimals);

  return { minPrice, minBidSize };
}

export function formatAuction(auction: Auction) {
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
  };
}
