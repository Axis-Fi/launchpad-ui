import { axisContracts } from "@repo/contracts";
import { Button, Input, LabelWrapper } from "@repo/ui";
import { useAllowance } from "loaders/use-allowance";
import React from "react";
import { Auction } from "src/types";
import { Address } from "viem";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function AuctionLive({ auction }: { auction: Auction }) {
  const [maxPrice, setMaxPrice] = React.useState<number>();
  const [amount, setAmount] = React.useState<number>();
  const { address } = useAccount(); // TODO add support for different recipient
  const contracts = axisContracts[auction.chainId];

  const referrer = "0x0"; // TODO referrer (e.g. frontend) address

  const bid = useWriteContract();

  const bidReceipt = useWaitForTransactionReceipt({ hash: bid.data });

  const { isSufficientAllowance, approveTx, execute } = useAllowance({
    ownerAddress: address,
    spenderAddress: contracts.auctionHouse.address,
    tokenAddress: auction.quoteToken.address as Address,
    decimals: Number(auction.quoteToken.decimals),
    chainId: auction.chainId,
    amount: Number(amount),
  });

  const auctionData = ""; // TODO using auction public key, encode the desired amount out

  // TODO Permit2 signature

  const handleBid = () => {
    bid.writeContract({
      abi: contracts.auctionHouse.abi,
      address: contracts.auctionHouse.address,
      functionName: "bid",
      args: [auction.lotId, address, referrer, amount, auctionData, "", ""], // TODO needs to be a BidParams struct
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
