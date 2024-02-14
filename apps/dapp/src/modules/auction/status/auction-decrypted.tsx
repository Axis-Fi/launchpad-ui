import { axisContracts } from "@repo/contracts";
import { InfoLabel } from "@repo/ui";
import { parseUnits } from "viem";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "..";

export function AuctionDecrypted({ auction }: PropsWithAuction) {
  const axisAddresses = axisContracts.addresses[auction.chainId];
  const settle = useWriteContract();
  const decryptReceipt = useWaitForTransactionReceipt({ hash: settle.data });

  const isLoading = settle.isPending || decryptReceipt.isLoading;
  const totalRaised = 0; //TODO: update values, add formatters

  const rate = 0;
  const amountBid = 0;
  const amountSecured = 0;

  const handleSettle = () => {
    settle.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "settle",
      args: [parseUnits(auction.lotId, 0)],
    });
  };

  return (
    <div className="flex justify-between">
      <AuctionInfoCard>
        <InfoLabel label="Total Raised" value={totalRaised} />
        <InfoLabel label="Rate" value={rate} />
      </AuctionInfoCard>
      <div className="w-[50%]">
        {/* @ts-expect-error TODO: remove expect*/}
        <AuctionInputCard
          submitText="Settle Auction"
          onClick={handleSettle}
          auction={auction}
        >
          <div className="bg-secondary text-foreground flex justify-between rounded-sm p-2">
            <InfoLabel
              label="You bid"
              value={`${amountBid} ${auction.quoteToken.symbol}`}
              className="text-5xl font-light"
            />
            <InfoLabel
              label="You got"
              value={`${amountSecured} ${auction.baseToken.symbol}`}
              className="text-5xl font-light"
            />
          </div>
        </AuctionInputCard>
        {isLoading && <p>Loading... </p>}
        {settle.isError && <p>{settle.error?.message}</p>}
        {decryptReceipt.isSuccess && <p>Success!</p>}
      </div>
    </div>
  );
}
