import React from "react";
import { Button, InfoLabel, cn } from "@repo/ui";
import { AuctionMetricsContainer } from "../auction-metrics-container";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { ProjectInfoCard } from "../project-info-card";
import { useAccount } from "wagmi";
import { useClaimBids } from "../hooks/use-claim-bids";
import { RequiresChain } from "components/requires-chain";
import { AuctionMetric } from "../auction-metric";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { SettledAuctionCard } from "modules/auction/settled-auction-card";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const [open, setOpen] = React.useState(false);
  const { address } = useAccount();
  const batchAuction = auction as BatchAuction;
  const cleared = auction.formatted?.cleared;
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const claimBids = useClaimBids(batchAuction);
  const userHasBids = batchAuction.bids.some(
    (b) =>
      b.bidder.toLowerCase() === address?.toLowerCase() &&
      b.status !== "claimed" &&
      b.status !== "refunded",
  );

  const isWaiting =
    claimBids.claimTx.isPending || claimBids.claimReceipt.isLoading;

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between">
        {isEMP && (
          <SettledAuctionCard
            className="mr-6 w-[60%]"
            auction={auction as BatchAuction}
          />
        )}
        <div className={cn("w-[40%]", !isEMP && "w-full")}>
          <AuctionInputCard submitText={""} auction={auction}>
            <div className="text-center">
              {cleared ? (
                <h4>Payout for this auction can be claimed!</h4>
              ) : (
                <h4>Auction could not be settled. Refunds may be claimed.</h4>
              )}
            </div>
            <RequiresChain chainId={auction.chainId}>
              {userHasBids && (
                <div className="flex justify-center">
                  <Button onClick={() => setOpen(true)} className="mt-4">
                    {cleared ? "CLAIM BIDS" : "CLAIM REFUND"}
                  </Button>
                </div>
              )}
            </RequiresChain>
          </AuctionInputCard>
        </div>
      </div>
      <div className="flex justify-between">
        <AuctionMetricsContainer auction={auction}>
          <InfoLabel
            label="Total Raised"
            value={`${auction.formatted?.purchased} ${auction.quoteToken.symbol}`}
          />

          <InfoLabel label="Total Bids" value={batchAuction.bids.length} />
          <InfoLabel
            label="Unique Participants"
            value={auction.formatted?.uniqueBidders}
          />

          <InfoLabel label="Ended" value={auction.formatted?.endFormatted} />
          {auction.linearVesting && (
            <AuctionMetric auction={auction} id="vestingDuration" />
          )}
        </AuctionMetricsContainer>
        <div className="w-1/2">
          <ProjectInfoCard auction={auction} />
        </div>
      </div>
      <TransactionDialog
        open={open}
        signatureMutation={claimBids.claimTx}
        error={claimBids.claimTx.error}
        onConfirm={claimBids.handleClaim}
        mutation={claimBids.claimReceipt}
        chainId={auction.chainId}
        onOpenChange={(open: boolean) => {
          if (!open) {
            claimBids.claimTx.reset();
          }
          setOpen(open);
        }}
        hash={claimBids.claimTx.data}
        disabled={isWaiting}
        screens={{
          idle: {
            Component: () => (
              <div className="text-center">
                You&apos;re about to claim all of your outstanding refunds and
                payouts for this auction.
              </div>
            ),
            title: `Confirm Claim Bids`,
          },
          success: {
            Component: () => (
              <div className="flex justify-center text-center">
                <p>Bids claimed successfully!</p>
              </div>
            ),
            title: "Transaction Confirmed",
          },
        }}
      />
    </div>
  );
}
