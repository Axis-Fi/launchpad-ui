import { BatchAuction, PropsWithAuction } from "@repo/types";
import { Card, Text, Metric, Progress } from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { calculateAuctionProgress } from "./utils/get-auction-progress";
import { AuctionMetricsContainer } from "./auction-metrics-container";
import { AuctionMetric } from "./auction-metric";

export function AuctionLaunchMetrics(
  props: PropsWithAuction & { className?: string },
) {
  const auction = props.auction as BatchAuction;
  const progress = calculateAuctionProgress(auction);
  const showProgress = auction.status === "live";

  return (
    <Card
      className={props.className}
      title="Launch Info"
      headerRightElement={
        <div className="flex gap-x-2">
          <Metric metricSize="sm" label="Quote Token Address">
            <BlockExplorerLink
              trim
              chainId={auction.chainId}
              address={auction.quoteToken.address}
            />
          </Metric>
          <Metric metricSize="sm" label="Base Token Address">
            <BlockExplorerLink
              trim
              chainId={auction.chainId}
              address={auction.baseToken.address}
            />
          </Metric>
        </div>
      }
    >
      {showProgress && (
        <div className="mb-4">
          <Text uppercase size="xs" spaced>
            Auction Progress
          </Text>
          <Progress value={progress} className="mt-1">
            <Metric label="Minimum Raise">
              {auction.formatted?.minFilled} {auction.quoteToken.symbol}
            </Metric>
          </Progress>
        </div>
      )}

      <AuctionMetricsContainer auction={auction}>
        <AuctionMetric id="targetRaise" />
        <AuctionMetric id="minRaise" />
        <AuctionMetric id="minPrice" />
        <AuctionMetric id="capacity" />
      </AuctionMetricsContainer>
    </Card>
  );
}
