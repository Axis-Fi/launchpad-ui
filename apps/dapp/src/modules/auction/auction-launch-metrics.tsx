import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
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
  const isSealedBid = auction.auctionType === AuctionType.SEALED_BID;
  const isFixedPrice = auction.auctionType === AuctionType.FIXED_PRICE;
  const isFixedPriceBatch =
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;
  const hasCurator = !!auction.curator && auction.curatorApproved;

  return (
    <Card
      className={props.className}
      title="Launch Info"
      headerRightElement={
        <div className="flex gap-x-2">
          <Metric size="s" label="Token Address">
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
          <Progress value={progress} className="mt-1" />
        </div>
      )}

      <AuctionMetricsContainer auction={auction}>
        <AuctionMetric id="targetRaise" />
        {!isFixedPrice && <AuctionMetric id="minRaise" />}
        {isSealedBid && <AuctionMetric id="minPrice" />}
        {isFixedPrice && <AuctionMetric id="price" />}
        {isFixedPriceBatch && <AuctionMetric id="fixedPrice" />}
        <AuctionMetric id="capacity" />
        {hasCurator && (
          <Metric label="Curator">
            <BlockExplorerLink
              trim
              chainId={auction.chainId}
              address={auction.curator!}
            />
          </Metric>
        )}
      </AuctionMetricsContainer>
    </Card>
  );
}
