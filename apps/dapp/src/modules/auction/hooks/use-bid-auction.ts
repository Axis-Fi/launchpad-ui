import React, { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Address, formatUnits, fromHex, toHex } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client/src/generated";
import { AuctionType } from "@repo/types";
import { useDeferredQuery } from "@repo/sdk/react";
import { useAllowance } from "loaders/use-allowance";
import { useAuction } from "modules/auction/hooks/use-auction";
import { useReferrer } from "state/referral";
import { getAuctionHouse } from "utils/contracts";
import { useStoreBid } from "state/bids/handlers";
import {
  auction as auctionCache,
  optimisticUpdate,
} from "modules/auction/utils/optimistic";

export function useBidAuction(
  id: string,
  auctionType: AuctionType,
  amountIn: bigint,
  amountOut: bigint,
  callbackData: `0x${string}`,
) {
  const { result: auction, queryKey } = useAuction(id, auctionType);
  const storeBidLocally = useStoreBid();

  if (!auction) throw new Error(`Unable to find auction ${id}`);

  const lotId = auction.lotId;
  const queryClient = useQueryClient();
  const { address: bidderAddress } = useAccount();
  const referrer = useReferrer();

  const bidTx = useWriteContract();

  const bidReceipt = useWaitForTransactionReceipt({ hash: bidTx.data });

  const auctionHouse = getAuctionHouse(auction);

  const bidConfig = useDeferredQuery((sdk) => {
    if (bidderAddress === undefined) {
      throw new Error("Wallet not connected. Please connect your wallet.");
    }

    // TODO: change SDK to use bigints
    return sdk.bid(
      {
        lotId: Number(lotId),
        amountIn: Number(formatUnits(amountIn, auction.quoteToken.decimals)),
        amountOut: Number(formatUnits(amountOut, auction.baseToken.decimals)),
        chainId: auction.chainId,
        auctionType: auctionType,
        referrerAddress: referrer,
        bidderAddress: bidderAddress,
        signedPermit2Approval: toHex(""), // TODO implement permit2
      },
      callbackData,
    );
  });

  // Main action, calls SDK which encrypts the bid and returns contract configuration data
  const handleBid = async () => {
    if (bidderAddress === undefined) {
      throw new Error("Not connected. Try connecting your wallet.");
    }
    const { abi, address, functionName, args } = await bidConfig();

    bidTx.writeContractAsync({ abi, address, functionName, args });
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
    amount: Number(formatUnits(amountIn, auction.quoteToken.decimals)),
  });

  // Store confirmed bids to prevent the React effect running multiple times due to tree rerenders.
  // (bidReceipt.isSuccess will be true until the user dismisses the modal, in that time the react tree can update)
  const confirmedBids = useRef(new Set<string>([]));

  React.useEffect(() => {
    if (!bidReceipt.isSuccess) return;

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
  ]);

  const error = [bidReceipt, bidTx, bidConfig].find((m) => m.isError)?.error;

  return {
    handleBid,
    approveCapacity,
    isSufficientAllowance,
    approveReceipt,
    bidReceipt,
    bidTx,
    bidDependenciesMutation: bidConfig,
    error,
    allowanceUtils,
  };
}
