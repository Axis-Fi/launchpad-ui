import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useAllowance } from "loaders/use-allowance";
import { useAuction } from "modules/auction/hooks/use-auction";
import { cloakClient } from "src/services/cloak";
import {
  Address,
  Hex,
  encodeAbiParameters,
  fromHex,
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

export function useBidAuction(
  id: string,
  auctionType: AuctionType,
  amountIn: number,
  amountOut: number,
) {
  const { result: auction, ...auctionQuery } = useAuction(id, auctionType);

  if (!auction) throw new Error(`Unable to find auction ${id}`);
  const lotId = auction.lotId;

  const { address } = useAccount();
  const referrer = useReferrer();
  const bidTx = useWriteContract();
  const bidReceipt = useWaitForTransactionReceipt({ hash: bidTx.data });

  const auctionHouse = getAuctionHouse(auction);

  // Bids need to be encrypted before submitting
  const encryptBidMutation = useMutation({
    mutationKey: ["encrypt", auction.id, amountOut],
    mutationFn: async () => {
      const baseTokenAmountOut = parseUnits(
        amountOut.toString(),
        Number(auction.baseToken.decimals),
      );

      const quoteTokenAmountIn = parseUnits(
        amountIn.toString(),
        Number(auction.quoteToken.decimals),
      );

      // TODO consider giving a state update on the encryption process
      const encryptedAmountOut = await cloakClient.keysApi.encryptLotIdPost({
        xChainId: auction.chainId,
        xAuctionHouse: auctionHouse.address,
        lotId: parseInt(auction.lotId),
        encryptRequest: {
          amount: toHex(quoteTokenAmountIn),
          amountOut: toHex(baseTokenAmountOut),
          bidder: address,
        },
      });

      return encryptedAmountOut;
    },
  });

  const auctionDataParams = [
    { name: "encryptedAmountOut", type: "uint256" },
    {
      name: "bidPublicKey",
      type: "tuple",
      internalType: "struct Point",
      components: [
        {
          name: "x",
          type: "uint256",
        },
        {
          name: "y",
          type: "uint256",
        },
      ],
    },
  ];
  // Main action, calls encrypt route and submits encrypted bids
  const handleBid = async () => {
    // Amount out needs to be a uint256
    const result = await encryptBidMutation.mutateAsync();

    const auctionData = encodeAbiParameters(auctionDataParams, [
      fromHex(result.ciphertext as Hex, "bigint"),
      {
        x: fromHex(result.x as Hex, "bigint"),
        y: fromHex(result.y as Hex, "bigint"),
      },
    ]);
    // Submit the bid to the contract
    bidTx.writeContract({
      abi: auctionHouse.abi,
      address: auctionHouse.address,
      functionName: "bid",
      args: [
        {
          lotId: parseUnits(auction.lotId, 0),
          referrer: referrer,
          amount: parseUnits(
            amountIn.toString(),
            Number(auction.quoteToken.decimals),
          ),
          auctionData,
          permit2Data: toHex(""),
        },
        toHex(""), //TODO: REVIEW PARAMETERS
      ],
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
      abi: auctionHouse.abi,
      address: auctionHouse.address,
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

  const error = [bidReceipt, bidTx, encryptBidMutation].find((m) => m.isError)
    ?.error;

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
    bidDependenciesMutation: encryptBidMutation,
    error,
    allowanceUtils,
  };
}
