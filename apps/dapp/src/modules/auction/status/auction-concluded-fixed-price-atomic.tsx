import { AuctionMetricsContainer } from "../auction-metrics-container";
import { Card, Metric } from "@repo/ui";
import type { PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { BlockExplorerLink } from "components/blockexplorer-link";

export function FixedPriceAtomicAuctionConcluded(props: PropsWithAuction) {
  return (
    <Card
      title="Launch Info"
      headerRightElement={
        <div className="flex gap-x-2">
          <Metric size="s" label="Token Address">
            <BlockExplorerLink
              trim
              chainId={props.auction.chainId}
              address={props.auction.baseToken.address}
            />
          </Metric>
        </div>
      }
    >
      <AuctionMetricsContainer auction={props.auction}>
        <AuctionMetric id="sold" />
        <AuctionMetric id="price" />
      </AuctionMetricsContainer>
    </Card>
  );
}
