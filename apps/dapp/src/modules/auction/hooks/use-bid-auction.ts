import { axisContracts } from "@repo/deployments";
import { useMutation } from "@tanstack/react-query";
import { useAllowance } from "loaders/use-allowance";
import { useAuction } from "modules/auction/hooks/use-auction";
import React from "react";
import { cloakClient } from "src/services/cloak";
import { Address, parseUnits, toHex } from "viem";
import {
  useAccount,
  useBalance,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useReferrer } from "state/referral";
import { usePermit2 } from "modules/token/use-permit2";

export function useBidAuction(
  lotId: string,
  chainId: number,
  amountIn: number,
  amountOut: number,
  withPermit2?: boolean,
) {
  const { result: auction, ...auctionQuery } = useAuction(lotId, chainId);

  if (!auction) throw new Error(`Unable to find auction ${lotId}`);

  const axisAddresses = axisContracts.addresses[auction.chainId];

  const { address } = useAccount();
  const referrer = useReferrer();
  const bidTx = useWriteContract();
  const bidReceipt = useWaitForTransactionReceipt({ hash: bidTx.data });

  const permit2 = usePermit2(
    auction.quoteToken.address,
    axisAddresses.auctionHouse,
  );

  // Bids need to be encrypted before submitting
  const encryptBidMutation = useMutation({
    mutationKey: ["encrypt", auction.id, amountOut],
    mutationFn: async () => {
      const baseTokenAmountOut = parseUnits(
        amountOut.toString(),
        Number(auction.baseToken.decimals),
      );

      // TODO consider giving a state update on the encryption process
      const encryptedAmountOut = await cloakClient.keysApi.encryptLotIdPost({
        xChainId: auction.chainId,
        xAuctionHouse: axisAddresses.auctionHouse,
        lotId: parseInt(auction.lotId),
        body: toHex(baseTokenAmountOut),
      });

      return encryptedAmountOut;
    },
  });

  // Main action, calls encrypt route and submits encrypted bids
  const handleBid = async () => {
    // Amount out needs to be a uint256

    const encryptedAmountOut = await encryptBidMutation.mutateAsync();

    // Submit the bid to the contract
    bidTx.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "bid",
      args: [
        {
          lotId: parseUnits(auction.lotId, 0),
          recipient: address as Address,
          referrer: referrer,
          amount: parseUnits(amountIn.toString(), auction.quoteToken.decimals),
          auctionData: encryptedAmountOut,
          allowlistProof: toHex(""),
          permit2Data: toHex(""),
        },
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
    execute: handleApprove,
    allowance,
  } = useAllowance({
    ownerAddress: address,
    spenderAddress: axisAddresses.auctionHouse,
    tokenAddress: auction.quoteToken.address as Address,
    decimals: Number(auction.quoteToken.decimals),
    chainId: auction.chainId,
    amount: Number(amountIn),
    disable: withPermit2,
  }); //TODO: refactor this

  React.useEffect(() => {
    if (bidReceipt.isSuccess) {
      balance.refetch();
      allowance.refetch();
      setTimeout(() => auctionQuery.refetch(), 5000); //TODO: ideas on how to improve this
    }
  }, [bidReceipt.isSuccess]);

  const error = [bidReceipt, bidTx, encryptBidMutation].find((m) => m.isError)
    ?.error;

  const approveCapacity = () => {
    const amount = parseUnits(amountIn.toString(), auction.quoteToken.decimals);
    console.log({ withPermit2 });
    return withPermit2 ? permit2.handleSignPermit(amount) : handleApprove();
  };

  return {
    handleBid,
    approveCapacity,
    balance,
    isSufficientAllowance,
    approveReceipt,
    bidReceipt,
    bidTx,
    bidDependenciesMutation: encryptBidMutation,
    error,
  };
}
