import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import {
  Card,
  Text,
  Metric,
  Progress,
  ToggleProvider,
  UsdToggle,
} from "@repo/ui";
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
  const isFixedPriceBatch =
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;

  return (
    <ToggleProvider initialToggle={true}>
      <Card
        className={props.className}
        title="Launch Info"
        headerRightElement={
          <div className="flex gap-x-8">
            <Metric size="s" label="Token Address">
              <BlockExplorerLink
                trim
                chainId={auction.chainId}
                address={auction.baseToken.address}
              />
            </Metric>
            <UsdToggle currencySymbol={auction.quoteToken.symbol} />
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
          <AuctionMetric id="minRaise" />
          {isSealedBid && <AuctionMetric id="minPrice" />}
          {isFixedPriceBatch && <AuctionMetric id="fixedPrice" />}
          <AuctionMetric id="capacity" />
        </AuctionMetricsContainer>
      </Card>
    </ToggleProvider>
  );
}
