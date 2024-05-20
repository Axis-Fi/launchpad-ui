import { InfoLabel, trimAddress } from "@repo/ui";
import { AuctionMetricsContainer } from "../auction-metrics-container";
import { PropsWithAuction } from "@repo/types";
import { AuctionInputCard } from "../auction-input-card";
import { AuctionMetric } from "../auction-metric";

export function AuctionCreated({ auction }: PropsWithAuction) {
  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionMetricsContainer auction={auction}>
          <AuctionMetric id="capacity" />
          <InfoLabel label="Creator" value={trimAddress(auction.seller)} />
          <InfoLabel label="Ends in" value={auction.formatted?.endDistance} />
        </AuctionMetricsContainer>
      </div>

      <div className="w-[40%]">
        <AuctionInputCard auction={auction} submitText="">
          <h3 className="text-center">
            Auction starts in {auction.formatted?.startDistance} at{" "}
            {auction.formatted?.startFormatted}.
          </h3>
        </AuctionInputCard>
      </div>
    </div>
  );
}
