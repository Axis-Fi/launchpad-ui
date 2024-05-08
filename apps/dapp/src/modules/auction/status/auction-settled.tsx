import React from "react";
import { Button, InfoLabel, cn } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionType, type PropsWithAuction } from "@repo/types";
import { ProjectInfoCard } from "../project-info-card";
import { useClaimProceeds } from "../hooks/use-claim-proceeds";
import { useAccount } from "wagmi";
import { useClaimBids } from "../hooks/use-claim-bids";
import { RequiresChain } from "components/requires-chain";
import { AuctionInfoLabel } from "../auction-info-labels";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { SettledAuctionCard } from "../settled-auction-card";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const [isClaimBids, setIsClaimingBids] = React.useState(false);
  const [isClaimingProceeds, setIsClaimingProceeds] = React.useState(false);

  const { address } = useAccount();
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const claimProceeds = useClaimProceeds(auction);
  const claimBids = useClaimBids(auction);
  const userHasBids = auction.bids.some(
    (b) => b.bidder.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between">
        {isEMP && <SettledAuctionCard className="w-[60%]" auction={auction} />}
        <div className={cn("w-[40%]", !isEMP && "w-full")}>
          <AuctionInputCard submitText={""} auction={auction}>
            <div className="text-center">
              <h4>Payout for this auction has been distributed!</h4>
            </div>
            <RequiresChain chainId={auction.chainId}>
              {address?.toLowerCase() === auction.owner.toLowerCase() && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsClaimingProceeds(true)}
                    className="mt-4"
                  >
                    CLAIM PROCEEDS
                  </Button>
                </div>
              )}
              {userHasBids && (
                <div className="flex justify-center">
                  <Button
                    onClick={() => setIsClaimingBids(true)}
                    className="mt-4"
                  >
                    CLAIM BIDS
                  </Button>
                </div>
              )}
            </RequiresChain>
          </AuctionInputCard>
        </div>
      </div>
      <div className="flex justify-between">
        <AuctionInfoCard>
          <InfoLabel
            label="Total Raised"
            value={`${auction.formatted?.purchased} ${auction.quoteToken.symbol}`}
          />

          <InfoLabel label="Total Bids" value={auction.bids.length} />
          <InfoLabel
            label="Unique Participants"
            value={auction.formatted?.uniqueBidders}
          />

          <InfoLabel label="Ended" value={auction.formatted?.endFormatted} />
          <AuctionInfoLabel auction={auction} id="vestingDuration" />
        </AuctionInfoCard>
        <div className="w-1/2">
          <ProjectInfoCard auction={auction} />
        </div>
      </div>
      <TransactionDialog
        signatureMutation={claimBids.claimTx}
        mutation={claimBids.claimReceipt}
        chainId={auction.chainId}
        hash={claimBids.claimTx.data!}
        onConfirm={claimBids.handleClaim}
        open={isClaimBids}
        onOpenChange={(open) => {
          setIsClaimingBids(open);

          if (claimBids.claimTx.isError) {
            claimBids.claimTx.reset();
          }
        }}
      />
      <TransactionDialog
        signatureMutation={claimProceeds.claimTx}
        mutation={claimProceeds.claimReceipt}
        chainId={auction.chainId}
        hash={claimProceeds.claimTx.data!}
        onConfirm={claimProceeds.handleClaim}
        open={isClaimingProceeds}
        onOpenChange={(open) => {
          setIsClaimingBids(open);

          if (claimProceeds.claimTx.isError) {
            claimProceeds.claimTx.reset();
          }
        }}
      />
    </div>
  );
}
