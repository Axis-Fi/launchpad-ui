import React from "react";
import { useAllowance } from "loaders/use-allowance";
import { useAuction } from "modules/auction/hooks/use-auction";
import { Address, fromHex, toHex } from "viem";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useReferrer } from "state/referral";
import { AuctionType } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";
import { useDeferredQuery } from "@repo/sdk/react";
import { useStoreBid } from "state/bids/handlers";

export function useBidAuction(
  id: string,
  auctionType: AuctionType,
  amountIn: number,
  amountOut: number,
  callbackData: `0x${string}`,
) {
  const { result: auction, ...auctionQuery } = useAuction(id, auctionType);
  const storeBidLocally = useStoreBid();

  if (!auction) throw new Error(`Unable to find auction ${id}`);
  const lotId = auction.lotId;

  const { address: bidderAddress } = useAccount();
  const referrer = useReferrer();
  const bidTx = useWriteContract();
  const bidReceipt = useWaitForTransactionReceipt({ hash: bidTx.data });

  const auctionHouse = getAuctionHouse(auction);

  const bidConfig = useDeferredQuery((sdk) => {
    if (bidderAddress === undefined) {
      throw new Error("Wallet not connected. Please connect your wallet.");
    }

    return sdk.bid(
      {
        lotId: Number(lotId),
        amountIn: Number(amountIn),
        amountOut: Number(amountOut),
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

  // We need to know user's balance and allowance
  const balance = useBalance({
    address: bidderAddress,
    token: auction.quoteToken.address as Address,
    chainId: auction.chainId,
  });

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
    amount: Number(amountIn),
  });

  console.log({ bidReceipt });
  React.useEffect(() => {
    // Refetch balance, allowance, refetches delayed auction info
    // and stores bid if EMP
    if (bidReceipt.isSuccess) {
      balance.refetch();
      allowance.refetch();
      // Delay refetching to ensure subgraph has caught up with the changes
      setTimeout(() => auctionQuery.refetch(), 5000); //TODO: ideas on how to improve this

      // Store user's bid amount locally
      if (auction.auctionType === AuctionType.SEALED_BID) {
        const hexBidId = bidReceipt.data.logs[1].topics[2];

        const bidId = fromHex(hexBidId!, "number").toString();

        //Stores bid using
        storeBidLocally({
          auctionId: auction.id,
          address: bidderAddress!,
          bidId,
          amountOut,
        });
      }
    }
  }, [bidReceipt.isSuccess]);

  const error = [bidReceipt, bidTx, bidConfig].find((m) => m.isError)?.error;

  return {
    handleBid,
    approveCapacity,
    balance,
    isSufficientAllowance,
    approveReceipt,
    bidReceipt,
    bidTx,
    bidDependenciesMutation: bidConfig,
    error,
    allowanceUtils,
  };
}
