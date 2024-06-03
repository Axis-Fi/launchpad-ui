import { AuctionMetricsContainer } from "../auction-metrics-container";
import { Card } from "@repo/ui";
import type { PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { ProjectInfoCard } from "../project-info-card";

export function FixedPriceBatchAuctionConcluded(props: PropsWithAuction) {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex w-1/2 flex-col gap-y-4">
          <Card title="Launch Info">
            <AuctionMetricsContainer auction={props.auction}>
              <AuctionMetric auction={props.auction} id="totalBids" />
              <AuctionMetric auction={props.auction} id="totalBidAmount" />
              <AuctionMetric auction={props.auction} id="started" />
              <AuctionMetric auction={props.auction} id="ended" />
            </AuctionMetricsContainer>
          </Card>
          <ProjectInfoCard auction={props.auction} />
        </div>
        <div className="w-[40%]">
          <Card title="Concluded"></Card>
        </div>
      </div>
    </div>
  );
}
