import { AuctionMetricsContainer } from "../auction-metrics-container";
import { Card } from "@repo/ui";
import type { PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";

export function FixedPriceAuctionConcluded(props: PropsWithAuction) {
  return (
    <Card title="Launch Info">
      <AuctionMetricsContainer auction={props.auction}>
        <AuctionMetric id="sold" />
        <AuctionMetric id="price" />
      </AuctionMetricsContainer>
    </Card>
  );
}
