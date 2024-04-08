import { useGetAuctionLotQuery } from "@repo/subgraph-client/src/generated";
import { getAuctionStatus } from "../utils/get-auction-status";
import {
  Auction,
  EMPAuctionData,
  AuctionFormattedInfo,
  AuctionType,
  RawSubgraphAuctionWithEvents,
  FixedPriceAuctionData,
} from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getAuctionInfo } from "./use-auction-info";
import { formatUnits } from "viem";
import { formatDate } from "@repo/ui";
import { formatDistanceToNow } from "date-fns";
import { fromBasisPoints, trimCurrency } from "utils";
import { useAuctionData } from "modules/auction/hooks/use-auction-data";
import { useTokenLists } from "state/tokenlist";
import { formatAuctionTokens } from "../utils/format-tokens";
import { deployments } from "@repo/deployments";
import { fetchParams } from "utils/fetch";
import { getAuctionType } from "../utils/get-auction-type";
import { useDerivativeData } from "./use-derivative-data";

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: ReturnType<typeof useGetAuctionLotQuery>["refetch"];
};

export function useAuction(lotId?: string, chainId?: number): AuctionResult {
  const { getToken } = useTokenLists();

  const { data, refetch, isLoading, isRefetching } = useGetAuctionLotQuery(
    {
      endpoint: deployments[chainId!].subgraphURL,
      fetchParams,
    },
    { lotId: lotId! },
    { enabled: !!chainId && !!lotId },
  );

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

  const auctionType = getAuctionType(rawAuction?.auctionRef);

  const { data: auctionData } = useAuctionData({
    chainId,
    lotId,
    type: auctionType,
  });

  const { data: linearVesting } = useDerivativeData(lotId, chainId);

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

  if (!auctionType) {
    throw new Error(`Auction type ${auctionType} doesn't exist`);
  }
  return {
    refetch,
    result: {
      ...auction,
      ...tokens,
      auctionData,
      auctionType,
      linearVesting,
      formatted: formatAuction(auction, auctionType, auctionData),
      bids: updateBids(auction),
    },
    isLoading: isLoading, //|| infoQuery.isLoading,
    isRefetching,
  };
}

/** Formats Auction information for displaying purporses */
export function formatAuction(
  auction: RawSubgraphAuctionWithEvents,
  auctionType: AuctionType,
  auctionData?: EMPAuctionData | FixedPriceAuctionData,
): AuctionFormattedInfo {
  const startDate = new Date(Number(auction.start) * 1000);
  const endDate = new Date(Number(auction.conclusion) * 1000);

  const startFormatted = formatDate.fullLocal(startDate);
  const endFormatted = formatDate.fullLocal(endDate);
  const startDistance = formatDistanceToNow(startDate);
  const endDistance = formatDistanceToNow(endDate);
  const totalBidsDecrypted = auction.bids.filter(
    (b) => b.status === "decrypted",
  ).length;

  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;

  const totalBidAmount = auction.bids.reduce(
    (total, b) => total + Number(b.amountIn),
    0,
  );

  const auctionSpecificFields =
    auctionType === AuctionType.SEALED_BID
      ? addEMPFields(auctionData as EMPAuctionData, auction)
      : addFPFields(auctionData as FixedPriceAuctionData, auction);

  return {
    startDate,
    endDate,
    startFormatted,
    endFormatted,
    startDistance,
    endDistance,
    uniqueBidders,
    sold: trimCurrency(auction.sold),
    purchased: trimCurrency(auction.purchased),
    capacity: trimCurrency(auction.capacity),
    totalSupply: trimCurrency(
      formatUnits(
        BigInt(auction.baseToken.totalSupply),
        Number(auction.baseToken.decimals),
      ),
    ),
    totalBids: auction.bids.length,
    totalBidsDecrypted,
    totalBidAmount: trimCurrency(totalBidAmount),
    tokenPairSymbols: `${auction.quoteToken.symbol}/${auction.baseToken.symbol}`,
    ...auctionSpecificFields,
  };
}

function addEMPFields(
  auctionData: EMPAuctionData,
  auction: RawSubgraphAuctionWithEvents,
) {
  const minPrice = formatUnits(
    auctionData?.minimumPrice ?? 0n,
    Number(auction.quoteToken.decimals),
  );

  const minBidSize = formatUnits(
    auctionData?.minBidSize ?? 0n,
    Number(auction.baseToken.decimals),
  );

  const marginalPrice = formatUnits(
    auctionData?.marginalPrice ?? "",
    Number(auction.quoteToken.decimals),
  );

  return {
    marginalPrice: trimCurrency(marginalPrice),
    rate: trimCurrency(marginalPrice),
    minPrice: trimCurrency(minPrice),
    minBidSize: trimCurrency(minBidSize),
  };
}

function addFPFields(
  auctionData: FixedPriceAuctionData,
  auction: RawSubgraphAuctionWithEvents,
) {
  if (!auctionData) return;

  return {
    price: formatUnits(auctionData.price, Number(auction.quoteToken.decimals)),
    maxPayoutPercentage: fromBasisPoints(
      // 0.00 - 1.00
      //TODO: review and improve
      formatUnits(auctionData.maxPayoutPercentage, 18),
    ),
  };
}

/** Updates bids based off the remaining capacity
 * TODO: move to subgraph
 */
function updateBids(auction: RawSubgraphAuctionWithEvents) {
  let remainingCapacity = Number(auction.capacityInitial);

  const _bids = auction.bids
    .sort((a, b) => Number(b.submittedPrice) - Number(a.submittedPrice))
    .map((b) => {
      const amountOut = Number(b.settledAmountOut);
      if (!b.settledAmountOut || !isFinite(amountOut)) return b;

      //If the amountOut is lower than capacity,
      //this bid gets the rest of the capacity
      const settledAmountOut =
        remainingCapacity >= Number(b.settledAmountOut)
          ? b.settledAmountOut
          : remainingCapacity;

      remainingCapacity -= Number(b.settledAmountOut);

      return {
        ...b,
        settledAmountOut: settledAmountOut.toString(),
      };
    });

  return _bids;
}
