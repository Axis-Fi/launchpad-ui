import { Button, InfoLabel, cn } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionType, PropsWithAuction } from "@repo/types";
import { SettledAuctionChart } from "modules/auction/settled-auction-chart";
import { ProjectInfoCard } from "../project-info-card";
import { useClaimProceeds } from "../hooks/use-claim-proceeds";
import { useAccount } from "wagmi";
import { useClaimBids } from "../hooks/use-claim-bids";
import { RequiresChain } from "components/requires-chain";

export function AuctionSettled({ auction }: PropsWithAuction) {
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
        {isEMP && (
          <div className="w-1/2">
            <SettledAuctionChart
              lotId={auction.lotId}
              chainId={auction.chainId}
            />
          </div>
        )}
        <div className={cn("w-[40%]", !isEMP && "w-full")}>
          <AuctionInputCard submitText={""} auction={auction}>
            <div className="text-center">
              <h4>Payout for this auction has been distributed!</h4>
            </div>
            <RequiresChain chainId={auction.chainId}>
              {address?.toLowerCase() === auction.owner.toLowerCase() && (
                <div className="flex justify-center">
                  <Button onClick={claimProceeds.handleClaim} className="mt-4">
                    CLAIM PROCEEDS
                  </Button>
                </div>
              )}
              {userHasBids && (
                <div className="flex justify-center">
                  <Button onClick={claimBids.handleClaim} className="mt-4">
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
            value={`${auction.formatted?.tokenAmounts.in} ${auction.quoteToken.symbol}`}
          />

          <InfoLabel
            label="Rate"
            value={`${auction.formatted?.rate} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
          />

          <InfoLabel label="Total Bids" value={auction.bids.length} />
          <InfoLabel
            label="Unique Participants"
            value={auction.formatted?.uniqueBidders}
          />

          <InfoLabel label="Ended" value={auction.formatted?.endFormatted} />
        </AuctionInfoCard>
        <div className="w-1/2">
          <ProjectInfoCard auction={auction} />
        </div>
      </div>
    </div>
  );
}
