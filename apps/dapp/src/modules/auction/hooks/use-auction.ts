import {
  GetAtomicAuctionLotQuery,
  GetBatchAuctionLotQuery,
  useGetAtomicAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client/src/generated";
import type { UseQueryResult } from "@tanstack/react-query";
import { getAuctionStatus } from "../utils/get-auction-status";
import {
  Auction,
  EMPAuctionData,
  AuctionFormattedInfo,
  AuctionType,
  FixedPriceAuctionData,
  BatchSubgraphAuction,
  AtomicSubgraphAuction,
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
//import { useDerivativeData } from "./use-derivative-data";
import { parseAuctionId } from "../utils/parse-auction-id";

export type AuctionResult = {
  result?: Auction;
} & Pick<
  ReturnType<typeof useGetAtomicAuctionLotQuery>,
  "refetch" | "isLoading" | "isRefetching"
>;

const hookMap = {
  [AuctionType.SEALED_BID]: useGetBatchAuctionLotQuery,
  [AuctionType.FIXED_PRICE]: useGetAtomicAuctionLotQuery,
};

export function useAuction(
  id: string,
  auctionType: AuctionType,
): AuctionResult {
  const { getToken } = useTokenLists();

  const { chainId, lotId } = parseAuctionId(id);

  const useGetAuction = auctionType
    ? hookMap[auctionType]
    : useGetBatchAuctionLotQuery;

  const {
    data,
    refetch,
    isLoading,
    isRefetching,
    isSuccess,
  }: UseQueryResult<GetAtomicAuctionLotQuery | GetBatchAuctionLotQuery> =
    useGetAuction(
      {
        endpoint: deployments[chainId!].subgraphURL,
        fetchParams,
      },
      { id: id! },
      { enabled: !!chainId && !!id },
    );

  let rawAuction:
    | GetAtomicAuctionLotQuery["atomicAuctionLot"]
    | GetBatchAuctionLotQuery["batchAuctionLot"];

  if (isSuccess && auctionType === AuctionType.FIXED_PRICE) {
    rawAuction = (data as GetAtomicAuctionLotQuery)?.atomicAuctionLot;
  } else {
    rawAuction = (data as GetBatchAuctionLotQuery)?.batchAuctionLot;
  }

  const enabled = !!rawAuction && !!rawAuction?.created.infoHash;

  const { data: auctionInfo } = useQuery({
    enabled,
    queryKey: ["auction-info", rawAuction?.id, rawAuction?.created.infoHash],
    queryFn: () => getAuctionInfo(rawAuction?.created.infoHash || ""),
  });

  const { data: auctionData } = useAuctionData({
    chainId,
    lotId,
    type: auctionType,
  });

  //TODO: needs updating
  // const { data: linearVesting } = useDerivativeData({
  //   lotId,
  //   auctionType,
  //   chainId,
  // });

  if (!rawAuction) {
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

  const isEMP = auctionType === AuctionType.SEALED_BID;
  const formatted = formatAuction(auction, auctionType, auctionData);

  return {
    refetch,
    result: {
      ...auction,
      ...tokens,
      auctionData,
      auctionType,
      formatted,
      //TODO: improve this mess
      [isEMP ? "bids" : "purchases"]: isEMP
        ? updateBids(auction as BatchSubgraphAuction)
        : (rawAuction as AtomicSubgraphAuction).purchases,
    },
    isLoading: isLoading, //|| infoQuery.isLoading,
    isRefetching,
  };
}

/** Formats Auction information for displaying purporses */
export function formatAuction(
  auction: AtomicSubgraphAuction | BatchSubgraphAuction,
  auctionType: AuctionType,
  auctionData?: EMPAuctionData | FixedPriceAuctionData,
): AuctionFormattedInfo {
  if (!auction) throw new Error("No Auction provided to formatAuction");

  const startDate = new Date(Number(auction.start) * 1000);
  const endDate = new Date(Number(auction.conclusion) * 1000);

  const startFormatted = formatDate.fullLocal(startDate);
  const endFormatted = formatDate.fullLocal(endDate);
  const startDistance = formatDistanceToNow(startDate);
  const endDistance = formatDistanceToNow(endDate);

  const moduleFields =
    auctionType === AuctionType.SEALED_BID
      ? addEMPFields(
          auctionData as EMPAuctionData,
          auction as BatchSubgraphAuction,
        )
      : addFPFields(
          auctionData as FixedPriceAuctionData,
          auction as AtomicSubgraphAuction,
        );

  return {
    startDate,
    endDate,
    startFormatted,
    endFormatted,
    startDistance,
    endDistance,
    sold: trimCurrency(auction.sold),
    purchased: trimCurrency(auction.purchased),
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

function addEMPFields(
  auctionData: EMPAuctionData,
  auction: BatchSubgraphAuction,
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
  const totalBidsDecrypted = auction.bids.filter(
    (b) => b.status === "decrypted",
  ).length;

  const totalBidAmount = auction.bids.reduce(
    (total, b) => total + Number(b.amountIn),
    0,
  );

  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;

  return {
    marginalPrice: trimCurrency(marginalPrice),
    rate: trimCurrency(marginalPrice),
    minPrice: trimCurrency(minPrice),
    minBidSize: trimCurrency(minBidSize),
    totalBidAmount: trimCurrency(totalBidAmount),
    totalBids: auction.bids.length,
    totalBidsDecrypted,
    uniqueBidders,
  };
}

function addFPFields(
  auctionData: FixedPriceAuctionData,
  auction: AtomicSubgraphAuction,
) {
  if (!auctionData || !auction) return;

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
function updateBids(auction: BatchSubgraphAuction) {
  let remainingCapacity = Number(auction.capacityInitial);
  if (!auction.bids) {
    return [];
  }

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
