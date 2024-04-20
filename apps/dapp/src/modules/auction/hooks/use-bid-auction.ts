import React from "react";
import { axisContracts } from "@repo/deployments";
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
import { useSdkMutation } from "@repo/sdk/react";

export function useBidAuction(
  lotId: string,
  chainId: number,
  amountIn: number,
  amountOut: number,
) {
  const { result: auction, ...auctionQuery } = useAuction(lotId, chainId);

  if (!auction) throw new Error(`Unable to find auction ${lotId}`);

  const { address } = useAccount();
  const referrer = useReferrer();
  const bidTx = useWriteContract();
  const bidReceipt = useWaitForTransactionReceipt({ hash: bidTx.data });

  const bidMutation = useSdkMutation((sdk) => {
    if (address === undefined)
      throw new Error("Wallet not connected. Please connect your wallet.");

    return sdk.bid({
      lotId: Number(lotId),
      amountIn: Number(amountIn),
      amountOut: Number(amountOut),
      chainId,
      referrerAddress: referrer,
      bidderAddress: address,
      signedPermit2Approval: toHex(""), // TODO implement permit2
    });
  });

  const axisAddresses = axisContracts.addresses[auction.chainId];

  // Main action, calls SDK which encrypts the bid and returns contract configuration data
  const handleBid = async () => {
    if (address === undefined) {
      throw new Error("Not connected. Try connecting your wallet.");
    }
    const { config } = await bidMutation.mutateAsync();

    bidTx.writeContract({
      abi: config.abi,
      address: config.address,
      functionName: config.functionName,
      args: config.args,
    });
  };

  const handlePurchase = async () => {
    if (!address || !isAddress(address)) {
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
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "purchase",
      args: [
        {
          lotId: BigInt(lotId),
          referrer,
          recipient: address,
          amount: parseUnits(
            amountIn.toString(),
            Number(auction.quoteToken.decimals),
          ),
          minAmountOut: parseUnits(
            amountOut.toString(),
            Number(auction.baseToken.decimals),
          ),
          permit2Data: "0x",
          auctionData,
        },
        "0x",
      ],
    });
  };

  // We need to know user's balance and allowance
  const balance = useBalance({
    address,
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
    ownerAddress: address,
    spenderAddress: axisAddresses.auctionHouse,
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

  const error = [bidReceipt, bidTx, bidMutation].find((m) => m.isError)?.error;

  return {
    handleBid:
      auction.auctionType === AuctionType.SEALED_BID
        ? handleBid
        : handlePurchase,
    approveCapacity,
    balance,
    isSufficientAllowance,
    approveReceipt,
    bidReceipt,
    bidTx,
    bidDependenciesMutation: bidMutation,
    error,
    allowanceUtils,
  };
}
