import { axisContracts } from "@repo/contracts";
import { InfoLabel } from "@repo/ui";
import { parseUnits } from "viem";
import {
  //useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "..";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const axisAddresses = axisContracts.addresses[auction.chainId];
  //const { address } = useAccount();

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });

  const isLoading = refund.isPending || refundReceipt.isLoading;

  const bidId = 0n; //TODO: how to best get these
  const isUserRefundable = false;

  //TODO: add a refundable bid table
  // const refundableBids = auction.bids.filter((b) =>
  //   b.bidder.includes(address?.toLowerCase() ?? ""),
  // );

  // TODO TBD when we will automatically refund bids

  const handleRefund = () => {
    refund.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "refundBid",
      args: [parseUnits(auction.lotId, 0), bidId],
    });
  };
  console.log({ auction });

  return (
    <div className="flex justify-between">
      <AuctionInfoCard>
        <InfoLabel label="Total Raised" value={0} />
        <InfoLabel label="Rate" value={0} />
      </AuctionInfoCard>
      <div className="w-[40%]">
        {/* @ts-expect-error TODO: remove, slapped for preview*/}
        <AuctionInputCard
          onClick={handleRefund}
          submitText={isUserRefundable ? "Claim Refund" : ""}
          auction={auction}
        >
          <div className="text-center">
            <h4>Payout for this auction has been distributed!</h4>
            {isUserRefundable && (
              <p>Sorry, you didn&apos;t make it this time</p>
            )}
          </div>
        </AuctionInputCard>
        {isLoading && <p>Loading... </p>}
        {refund.isError && <p>{refund.error?.message}</p>}
        {refundReceipt.isSuccess && <p>Success!</p>}
      </div>
    </div>
  );
}
