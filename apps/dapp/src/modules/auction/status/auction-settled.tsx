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
import { trimCurrency } from "src/utils/currency";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const axisAddresses = axisContracts.addresses[auction.chainId];
  //const { address } = useAccount();

  const refund = useWriteContract();
  const refundReceipt = useWaitForTransactionReceipt({ hash: refund.data });

  const isLoading = refund.isPending || refundReceipt.isLoading;

  const bidId = 0n; //TODO: how to best get these
  const isUserRefundable = false;
  const tokenAmounts = auction.bidsDecrypted
    .filter((b) => Number(b.amountOut) > 0)
    .reduce(
      (total, b) => {
        total.in += Number(b.amountIn);
        total.out += Number(b.amountOut);
        return total;
      },
      { in: 0, out: 0 },
    );

  //TODO: add a refundable bid table
  // const refundableBids = auction.bids.filter((b) =>
  //   b.bidder.includes(address?.toLowerCase() ?? ""),
  // );

  const uniqueBidders = auction.bids
    .map((b) => b.bidder)
    .filter((b, i, a) => a.lastIndexOf(b) === i).length;

  const handleRefund = () => {
    refund.writeContract({
      abi: axisContracts.abis.auctionHouse,
      address: axisAddresses.auctionHouse,
      functionName: "refundBid",
      args: [parseUnits(auction.lotId, 0), bidId],
    });
  };
  console.log({ auction });

  const rate = trimCurrency(tokenAmounts.in / tokenAmounts.out);

  return (
    <div className="flex justify-between">
      <AuctionInfoCard>
        <InfoLabel
          label="Total Raised"
          value={`${tokenAmounts.in} ${auction.quoteToken.symbol}`}
        />
        <InfoLabel
          label="Rate"
          value={`${rate} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
        />

        <InfoLabel label="Total Bids" value={auction.bids.length} />
        <InfoLabel label="Unique Participants" value={uniqueBidders} />
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
