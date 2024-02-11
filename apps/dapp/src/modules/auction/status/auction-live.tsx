import { axisContracts } from "@repo/contracts";
import { Button, Input, LabelWrapper } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import { useReferral } from "loaders/use-referral";
import React from "react";
import { Auction } from "src/types";
import { cloakClient } from "src/services/cloak";
import { Address, parseUnits, toHex } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function AuctionLive({ auction }: { auction: Auction }) {
  const [maxPrice, setMaxPrice] = React.useState<number>();
  maxPrice; //
  const [amount, setAmount] = React.useState<number>(0);
  const { address } = useAccount(); // TODO add support for different recipient
  const axisAddresses = axisContracts.addresses[auction.chainId];

  const referrer = useReferral();

  const bid = useWriteContract();

  const bidReceipt = useWaitForTransactionReceipt({ hash: bid.data });

  const { isSufficientAllowance, approveTx, execute } = useAllowance({
    ownerAddress: address,
    spenderAddress: axisAddresses.auctionHouse,
    tokenAddress: auction.quoteToken.address as Address,
    decimals: Number(auction.quoteToken.decimals),
    chainId: auction.chainId,
    amount: Number(amount),
  });

  if (!address) {
    return <p>Connect wallet</p>;
  }

  // if (!amount) {
  //   return <p>Missing data</p>;
  // }

  // TODO Permit2 signature

  const handleBid = async () => {
    // Calculate and encrypt the minAmountOut
    const minAmountOut = maxPrice === undefined ? 0 : amount / maxPrice; // TODO decimal scaling and error handling

    console.log("minAmountOut", minAmountOut);

    const encryptedAmountOut = await cloakClient.keysApi.encryptLotIdPost({
      xChainId: auction.chainId,
      xAuctionHouse: axisAddresses.auctionHouse,
      lotId: parseInt(auction.lotId),
      body: toHex(minAmountOut),
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
          recipient: address,
          referrer: referrer,
          amount: parseUnits(
            amount.toString(),
            Number(auction.quoteToken.decimals),
          ),
          auctionData: encryptedAmountOut,
          allowlistProof: toHex(""),
          permit2Data: toHex(""),
        },
      ],
    });
  };

  return (
    <div>
      <div className="flex gap-x-2">
        <LabelWrapper content="Max Price">
          <Input
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            type="number"
          />
        </LabelWrapper>

        <LabelWrapper content="Amount">
          <Input
            type="number"
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </LabelWrapper>
        {isSufficientAllowance ? (
          <Button onClick={handleBid} className="self-end">
            Bid
          </Button>
        ) : (
          <div className="flex self-end">
            <Button disabled={approveTx.isLoading} onClick={() => execute()}>
              {approveTx.isLoading ? "Waiting" : "Approve"}
            </Button>
          </div>
        )}
      </div>

      {bidReceipt.isLoading && <p>Loading... </p>}
      {bid.isError && <p>{bidReceipt.error?.message}</p>}
      {bidReceipt.isSuccess && <p>Success!</p>}
    </div>
  );
}
