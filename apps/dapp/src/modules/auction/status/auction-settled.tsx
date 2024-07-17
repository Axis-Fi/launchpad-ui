import { Card, Metric } from "@repo/ui";
import { AuctionMetrics } from "../auction-metrics";
import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { SettledAuctionCard } from "modules/auction/settled-auction-card";
import { ProjectInfoCard } from "../project-info-card";
import { ClaimCard } from "../claim-card";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { useBaseDTLCallback } from "../hooks/use-base-dtl-callback";
import { TokenInfoCard } from "../token-info-card";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });

  return (
    <div className="auction-action-container">
      <div className="w-2/3 space-y-4">
        {isEMP && <SettledAuctionCard auction={auction as BatchAuction} />}
        <Card
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
          <AuctionMetrics>
            <AuctionMetric auction={auction} id="totalRaised" />
            <AuctionMetric auction={auction} id="clearingPrice" />
            <AuctionMetric auction={auction} id="tokensLaunched" />
            <AuctionMetric auction={auction} id="protocolFee" />
            <AuctionMetric auction={auction} id="referrerFee" />
            <AuctionMetric auction={auction} id="duration" />
            <AuctionMetric auction={auction} id="derivative" />
            {dtlCallbackConfiguration && (
              <Metric
                label="Direct to Liquidity"
                size="m"
                tooltip="The percentage of proceeds that will be automatically deposited into the liquidity pool"
                className=""
              >
                {dtlCallbackConfiguration.proceedsUtilisationPercent * 100}%
              </Metric>
            )}
          </AuctionMetrics>
        </Card>

        <TokenInfoCard auction={auction} />
        <ProjectInfoCard auction={auction} />
      </div>
      <ClaimCard auction={auction} />
    </div>
  );
}
