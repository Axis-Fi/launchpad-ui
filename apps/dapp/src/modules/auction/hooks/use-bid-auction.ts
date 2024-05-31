import React from "react";
import { useAllowance } from "loaders/use-allowance";
import { useAuction } from "modules/auction/hooks/use-auction";
import {
  Address,
  encodeAbiParameters,
  isAddress,
  parseAbiParameters,
  parseUnits,
  toHex,
} from "viem";
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

export function useBidAuction(
  id: string,
  auctionType: AuctionType,
  amountIn: number,
  amountOut: number,
) {
  const { result: auction, ...auctionQuery } = useAuction(id, auctionType);

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

    return sdk.bid({
      lotId: Number(lotId),
      amountIn: Number(amountIn),
      amountOut: Number(amountOut),
      chainId: auction.chainId,
      auctionType: auctionType,
      referrerAddress: referrer,
      bidderAddress: bidderAddress,
      signedPermit2Approval: toHex(""), // TODO implement permit2
    });
  });

  // Main action, calls SDK which encrypts the bid and returns contract configuration data
  const handleBid = async () => {
    if (bidderAddress === undefined) {
      throw new Error("Not connected. Try connecting your wallet.");
    }
    const { abi, address, functionName, args } = await bidConfig();

    bidTx.writeContract({ abi, address, functionName, args });
  };

  const handlePurchase = async () => {
    if (!bidderAddress || !isAddress(bidderAddress)) {
      throw new Error("Not connected");
    }
    const minAmountOut = parseUnits(
      amountOut.toString(),
      Number(auction.baseToken.decimals),
    );

    const auctionData = encodeAbiParameters(
      parseAbiParameters("uint96 minAmountOut"),
      [minAmountOut],
    );

    bidTx.writeContract({
      abi: auctionHouse.abi,
      address: auctionHouse.address,
      functionName: "purchase",
      args: [
        {
          lotId: BigInt(lotId),
          referrer,
          recipient: bidderAddress,
          amount: parseUnits(
            amountIn.toString(),
            Number(auction.quoteToken.decimals),
          ),
          minAmountOut: parseUnits(
            amountOut.toString(),
            Number(auction.baseToken.decimals),
          ),
          permit2Data: toHex(""), // TODO support permit2
          auctionData,
        },
        toHex(""), // No callback parameters being passed. TODO update when callback support is added.
      ],
    });
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

  React.useEffect(() => {
    if (bidReceipt.isSuccess) {
      balance.refetch();
      allowance.refetch();
      setTimeout(() => auctionQuery.refetch(), 5000); //TODO: ideas on how to improve this
    }
  }, [bidReceipt.isSuccess]);

  const error = [bidReceipt, bidTx, bidConfig].find((m) => m.isError)?.error;

  return {
    handleBid:
      auction.auctionType === AuctionType.SEALED_BID ||
      auction.auctionType === AuctionType.FIXED_PRICE_BATCH
        ? handleBid
        : handlePurchase,
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
