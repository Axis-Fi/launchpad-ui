import { axisContracts } from "@repo/contracts";
import { InfoLabel } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { useReferral } from "loaders/use-referral";
import React from "react";
import { cloakClient } from "src/services/cloak";
import { Address, parseUnits, toHex } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionInfoCard } from "../auction-info-card";
import { SubgraphAuction } from "loaders/subgraphTypes";

export function AuctionLive({ auction }: { auction: SubgraphAuction }) {
  const [baseTokenAmount, setBaseTokenAmount] = React.useState<number>(0);
  baseTokenAmount; //
  const [quoteTokenAmount, setQuoteTokenAmount] = React.useState<number>(0);
  const { address } = useAccount(); // TODO add support for different recipient
  const axisAddresses = axisContracts.addresses[auction.chainId];

  const referrer = useReferral();

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
    amount: Number(quoteTokenAmount),
  });

  // TODO Permit2 signature

  const handleBid = async () => {
    // Amount out needs to be a uint256
    const baseTokenAmountOut = parseUnits(
      baseTokenAmount.toString(),
      Number(auction.baseToken.decimals),
    );
    console.log("baseTokenAmountOut", baseTokenAmountOut.toString());

    const encryptedAmountOut = await cloakClient.keysApi.encryptLotIdPost({
      xChainId: auction.chainId,
      xAuctionHouse: axisAddresses.auctionHouse,
      lotId: parseInt(auction.lotId),
      body: baseTokenAmountOut.toString(),
    });

    console.log("encryptedAmountOut", encryptedAmountOut);

    console.log("referrer", referrer);

    // Submit the bid to the contract
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
            quoteTokenAmount.toString(),
            Number(auction.quoteToken.decimals),
          ),
          auctionData: encryptedAmountOut,
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
            onChangeAmountIn={(e) =>
              setQuoteTokenAmount(Number(e.target.value))
            }
            onChangeMinAmountOut={(e) =>
              setBaseTokenAmount(Number(e.target.value))
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
