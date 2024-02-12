import { axisContracts } from "@repo/contracts";
import { InfoLabel } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import React from "react";
import { Auction } from "src/types";
import { Address, parseUnits, toHex } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionInfoCard } from "../auction-info-card";

export function AuctionLive({ auction }: { auction: Auction }) {
  /* eslint-disable-next-line */
  const [minAmountOut, setMinAmountOut] = React.useState<number>(0);
  const [amountIn, setAmountIn] = React.useState<number>(0);
  const { address } = useAccount(); // TODO add support for different recipient
  const axisAddresses = axisContracts.addresses[auction.chainId];

  const referrer = "0x0"; // TODO referrer (e.g. frontend) address

  const bid = useWriteContract();

  const bidReceipt = useWaitForTransactionReceipt({ hash: bid.data });

  const {
    isSufficientAllowance,
    approveTx,
    execute: approveCapacity,
  } = useAllowance({
    ownerAddress: address,
    spenderAddress: axisAddresses.auctionHouse,
    tokenAddress: auction.quoteToken.address as Address,
    decimals: Number(auction.quoteToken.decimals),
    chainId: auction.chainId,
    amount: Number(amountIn),
  });

  const auctionData = ""; // TODO using auction public key, encode the desired amount out

  // TODO Permit2 signature

  const handleBid = () => {
    bid.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "bid",
      args: [
        {
          lotId: parseUnits(auction.lotId, 0),
          recipient: address as Address,
          referrer: referrer,
          amount: parseUnits(
            amountIn?.toString() ?? "0",
            Number(auction.quoteToken.decimals),
          ),
          auctionData: toHex(auctionData),
          allowlistProof: toHex(""),
          permit2Data: toHex(""),
        },
      ],
    });
  };

  const handleSubmit = () => {
    isSufficientAllowance ? handleBid() : approveCapacity();
  };

  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionInfoCard>
          <InfoLabel label="Minimum Bid" value="??" />
          <InfoLabel label="Creator" value="??" />
        </AuctionInfoCard>
      </div>

      <div className="w-[40%]">
        <AuctionInputCard
          submitText={
            isSufficientAllowance
              ? "Bid"
              : approveTx.isLoading
                ? "Confirming..."
                : "Approve"
          }
          auction={auction}
          onClick={handleSubmit}
        >
          <AuctionBidInput
            onChangeAmountIn={(e) => setAmountIn(Number(e.target.value))}
            onChangeMinAmountOut={(e) =>
              setMinAmountOut(Number(e.target.value))
            }
            auction={auction}
          />
        </AuctionInputCard>

        {bidReceipt.isLoading && <p>Confirming transaction...</p>}
        {bid.isError && <p>{bid.error?.message}</p>}
        {bidReceipt.isError && <p>{bidReceipt.error?.message}</p>}
        {bidReceipt.isSuccess && <p>Success!</p>}
      </div>
    </div>
  );
}
