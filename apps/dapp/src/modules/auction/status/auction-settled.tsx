import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { AuctionInputCard } from "../auction-input-card";
import { PropsWithAuction } from "@repo/types";
import { SettledAuctionChart } from "modules/auction/settled-auction-chart";
import { ProjectInfoCard } from "../project-info-card";

export function AuctionSettled({ auction }: PropsWithAuction) {
  return (
    <div className="w-full">
      <div className="mb-8 flex justify-between">
        <div className="w-1/2">
          <SettledAuctionChart
            lotId={auction.lotId}
            chainId={auction.chainId}
          />
        </div>
        <div className="w-[40%]">
          <AuctionInputCard submitText={""} auction={auction}>
            <div className="text-center">
              <h4>Payout for this auction has been distributed!</h4>
            </div>
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
        </AuctionInfoCard>
        <div className="w-1/2">
          <ProjectInfoCard auction={auction} />
        </div>
      </div>
    </div>
  );
}
