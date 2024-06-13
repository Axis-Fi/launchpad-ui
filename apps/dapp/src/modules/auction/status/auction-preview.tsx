import { AuctionType, PropsWithAuction } from "@repo/types";
import { AuctionLaunchMetrics } from "../auction-launch-metrics";
import { Card } from "@repo/ui";
import { AuctionMetricsContainer } from "../auction-metrics-container";
import { AuctionMetric } from "../auction-metric";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionBidInputSingle } from "../auction-bid-input-single";

export function AuctionLivePreview({ auction }: PropsWithAuction) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;

  return (
    <div className="mt-4 flex justify-between gap-x-8">
      <div className="w-2/3 space-y-4">
        <AuctionLaunchMetrics auction={auction} />

        <Card title="Token Info">
          {isEMP ? (
            <AuctionMetricsContainer className="mt-4" auction={auction}>
              <AuctionMetric id="minPriceFDV" />
              <AuctionMetric id="totalSupply" />
              <AuctionMetric id="vestingDuration" />
              <AuctionMetric id="auctionedSupply" />
            </AuctionMetricsContainer>
          ) : (
            <AuctionMetricsContainer className="mt-4" auction={auction}>
              <AuctionMetric id="fixedPriceFDV" />
              <AuctionMetric id="totalSupply" />
              <AuctionMetric id="vestingDuration" />
              <AuctionMetric id="auctionedSupply" />
            </AuctionMetricsContainer>
          )}
        </Card>
        <ProjectInfoCard auction={auction} />
      </div>
      <div className="w-1/3">
        <Card
          title={!isEMP ? `Buy ${auction.baseToken.symbol}` : `Place your bid`}
        >
          {isEMP ? (
            <AuctionBidInput auction={auction} />
          ) : (
            <AuctionBidInputSingle auction={auction} />
          )}
        </Card>
      </div>
    </div>
  );
}
