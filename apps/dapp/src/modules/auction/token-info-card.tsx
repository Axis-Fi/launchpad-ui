import { Card, Metric } from "@repo/ui";
import { AuctionType, type PropsWithAuction } from "@repo/types";
import { useBaseDTLCallback } from "modules/auction/hooks/use-base-dtl-callback";
import { AuctionMetrics } from "./auction-metrics";
import { AuctionMetric } from "./auction-metric";

export function TokenInfoCard({ auction }: PropsWithAuction) {
  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });
  // TODO add support for baseline callbacks

  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const isFixedPriceBatch =
    auction.auctionType === AuctionType.FIXED_PRICE_BATCH;

  const isVested = !!auction.linearVesting;

  return (
    <Card title="Token Info">
      <AuctionMetrics className="mt-4">
        {isEMP && <AuctionMetric id="minPriceFDV" auction={auction} />}
        {isFixedPriceBatch && (
          <AuctionMetric id="fixedPriceFDV" auction={auction} />
        )}
        <AuctionMetric id="totalSupply" auction={auction} />
        <AuctionMetric id="tokensAvailable" auction={auction} />
        {isVested && <AuctionMetric id="vestingDuration" auction={auction} />}
        {dtlCallbackConfiguration && (
          // TODO fix alignment of metric title
          <Metric
            label="Direct to Liquidity"
            size="m"
            tooltip="The percentage of proceeds that will be automatically deposited into the liquidity pool"
          >
            {dtlCallbackConfiguration.proceedsUtilisationPercent * 100}%
          </Metric>
        )}
      </AuctionMetrics>
    </Card>
  );
}
