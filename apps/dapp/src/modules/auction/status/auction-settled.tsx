import { Button, InfoLabel, cn } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { SettledAuctionChart } from "modules/auction/settled-auction-chart";
import { ProjectInfoCard } from "../project-info-card";
import { useAccount } from "wagmi";
import { useClaimBids } from "../hooks/use-claim-bids";
import { RequiresChain } from "components/requires-chain";
import { AuctionInfoLabel } from "../auction-info-labels";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const { address } = useAccount();
  const batchAuction = auction as BatchAuction;
  const cleared = auction.formatted?.marginalPrice !== "0.00";
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const claimBids = useClaimBids(batchAuction);
  const userHasBids = batchAuction.bids.some(
    (b) => b.bidder.toLowerCase() === address?.toLowerCase(),
  );

  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between">
        {isEMP && (
          <div className="w-1/2">
            <SettledAuctionChart auction={auction as BatchAuction} />
          </div>
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
                  <Button onClick={claimBids.handleClaim} className="mt-4">
                    {cleared ? "CLAIM BIDS" : "CLAIM REFUND"}
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

          <InfoLabel
            label="Clearing Rate"
            value={`${auction.formatted?.marginalPrice} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
          />

          <InfoLabel label="Total Bids" value={batchAuction.bids.length} />
          <InfoLabel
            label="Unique Participants"
            value={auction.formatted?.uniqueBidders}
          />

          <InfoLabel label="Ended" value={auction.formatted?.endFormatted} />
          {auction.linearVesting && (
            <AuctionInfoLabel auction={auction} id="vestingDuration" />
          )}
        </AuctionInfoCard>
        <div className="w-1/2">
          <ProjectInfoCard auction={auction} />
        </div>
      </div>
    </div>
  );
}
