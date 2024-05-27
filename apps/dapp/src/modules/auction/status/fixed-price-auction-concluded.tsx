import { AuctionMetricsContainer } from "../auction-metrics-container";
import { PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";

export function FixedPriceAuctionConcluded(props: PropsWithAuction) {
  return (
    <div>
      <div className="flex justify-between">
        <AuctionMetricsContainer auction={props.auction}>
          <AuctionMetric id="sold" />
          <AuctionMetric id="price" />
        </AuctionMetricsContainer>
      </div>
    </div>
  );
}
