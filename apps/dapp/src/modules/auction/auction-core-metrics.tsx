import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { Card, Text, Metric, UsdToggle } from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { AuctionMetricsContainer } from "./auction-metrics-container";
import { AuctionMetric } from "./auction-metric";
import AuctionProgressBar from "./auction-progress-bar";

export function AuctionCoreMetrics(
  props: PropsWithAuction & { className?: string },
) {
  const auction = props.auction as BatchAuction;

  const showProgress = auction.status === "live";
  const isSealedBid = auction.auctionType === AuctionType.SEALED_BID;
  const isFixedPriceBatch =
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;
  const isSuccessful =
    isSealedBid && auction.encryptedMarginalPrice?.settlementSuccessful;
  const isVested = !!auction.linearVesting;

  return (
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
          <AuctionProgressBar auction={auction} />
        </div>
      )}

      <AuctionMetricsContainer auction={auction}>
        <AuctionMetric id="targetRaise" />
        <AuctionMetric id="minRaise" />
        {isSealedBid && <AuctionMetric id="minPrice" />}
        {isSealedBid && <AuctionMetric id="minPriceFDV" />}
        {isFixedPriceBatch && <AuctionMetric id="fixedPrice" />}
        {isFixedPriceBatch && <AuctionMetric id="fixedPriceFDV" />}

        <AuctionMetric id="totalSupply" />
        <AuctionMetric id="tokensAvailable" />

        {isSuccessful && (
          <>
            {/* TODO: review if we need these metrics somewhere */}
            {/* <AuctionMetric auction={auction} id="totalRaised" /> */}
            {/* <AuctionMetric auction={auction} id="clearingPrice" />*/}
            <AuctionMetric auction={auction} id="tokensLaunched" />
          </>
        )}

        {isVested && <AuctionMetric id="vestingDuration" auction={auction} />}
        {/*isDTL && <AuctionMetric id="dtlProceeds" />*/}
      </AuctionMetricsContainer>
    </Card>
  );
}
