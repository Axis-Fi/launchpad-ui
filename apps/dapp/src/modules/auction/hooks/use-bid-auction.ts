import React, { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Address, formatUnits, fromHex, toHex, zeroAddress } from "viem";
import { useAccount } from "wagmi";
import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client";
import { AuctionType } from "@repo/types";
import { useBid } from "@repo/sdk/react";
import { useAllowance } from "loaders/use-allowance";
import { useAuction } from "modules/auction/hooks/use-auction";
import { useReferrer } from "state/referral";
import { getAuctionHouse } from "utils/contracts";
import { useStoreBid } from "state/bids/handlers";
import {
  auction as auctionCache,
  optimisticUpdate,
} from "modules/auction/utils/optimistic";
import { getAuctionId } from "../utils/get-auction-id";
import analytics from "modules/app/analytics";

export function useBidAuction(
  chainId: string | number,
  lotId: string | number,
  amountIn: bigint,
  amountOut: bigint,
  callbackData: `0x${string}`,
  onSuccess?: () => void,
) {
  const { result: auction, queryKey } = useAuction(chainId, lotId);
  const id = getAuctionId(chainId, lotId);

  const storeBidLocally = useStoreBid();

  if (!auction) throw new Error(`Unable to find auction ${id}`);

  const queryClient = useQueryClient();
  const { address: bidderAddress } = useAccount();
  const referrer = useReferrer();

  const auctionHouse = getAuctionHouse(auction);

  const bid = useBid({
    lotId: Number(lotId),
    amountIn,
    amountOut,
    chainId: auction.chainId,
    auctionType: auction.auctionType,
    referrerAddress:
      referrer === zeroAddress ? (auction.seller as Address) : referrer,
    bidderAddress: bidderAddress!,
    signedPermit2Approval: toHex(""), // TODO implement permit2
    callbackData,
  });

  const bidTx = bid.transaction;

  const bidReceipt = bid.receipt;

  // Main action, calls SDK which encrypts the bid and returns contract configuration data
  const handleBid = async () => {
    if (bidderAddress === undefined) {
      throw new Error("Not connected. Try connecting your wallet.");
    }

    analytics.trackEvent("bid", {
      props: {
        auction: auction.id,
        chainId: auction.chainId,
      },
    });

    bid.submit?.();
  };

  const {
    isSufficientAllowance,
    approveReceipt,
    execute: approveCapacity,
    allowance,
    ...allowanceUtils
  } = useAllowance({
    ownerAddress: bidderAddress,
    spenderAddress: auctionHouse.address,
    tokenAddress: auction.quoteToken.address as Address,
    decimals: Number(auction.quoteToken.decimals),
    chainId: auction.chainId,
    amount: amountIn,
  });

  // Store confirmed bids to prevent the React effect running multiple times due to tree rerenders.
  // (bidReceipt.isSuccess will be true until the user dismisses the modal, in that time the react tree can update)
  const confirmedBids = useRef(new Set<string>([]));

  React.useEffect(() => {
    if (bidReceipt == null || !bidReceipt.isSuccess) return;

    // Get bid id from transaction logs
    const hexBidId = bidReceipt.data.logs[1].topics[2];
    const bidId = fromHex(hexBidId!, "number").toString();
    const hasAlreadyHandledBid = confirmedBids.current.has(bidId);

    if (hasAlreadyHandledBid) return;
    confirmedBids.current.add(bidId);

    allowance.refetch();

    // If this is a blind auction, store the user's unencrypted bid locally
    // so they can view it later
    if (auction.auctionType === AuctionType.SEALED_BID) {
      storeBidLocally({
        auctionId: auction.id,
        address: bidderAddress!,
        bidId,
        amountOut: formatUnits(amountOut, auction.baseToken.decimals),
      });
    }

    // Cache the bid locally, to prevent subgraph update delays not returning the user's bid
    optimisticUpdate(
      queryClient,
      queryKey,
      (cachedAuction: GetBatchAuctionLotQuery) =>
        auctionCache.insertBid(
          cachedAuction,
          bidId,
          bidderAddress!,
          amountIn,
          amountOut,
        ),
    );

    // Consumer can pass optional callback to be executed after the bid is successful
    onSuccess?.();
  }, [
    allowance,
    amountIn,
    amountOut,
    auction,
    bidReceipt,
    bidderAddress,
    queryClient,
    queryKey,
    storeBidLocally,
    bidTx,
    onSuccess,
  ]);

  return {
    handleBid,
    approveCapacity,
    isSufficientAllowance,
    approveReceipt,
    bidReceipt,
    bidTx,
    isWaiting: bid.isWaiting,
    receipt: bidReceipt,
    error: bid.error,
    allowanceUtils,
  };
}
