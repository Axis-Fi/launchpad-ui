import { Card, Metric } from "@repo/ui";
import { AuctionMetrics } from "../auction-metrics";
import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { SettledAuctionCard } from "modules/auction/settled-auction-card";
import { ProjectInfoCard } from "../project-info-card";
import { ClaimCard } from "../claim-card";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { useBaseDTLCallback } from "../hooks/use-base-dtl-callback";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;
  const { data: dtlCallbackConfiguration } = useBaseDTLCallback({
    chainId: auction.chainId,
    lotId: auction.lotId,
    baseTokenDecimals: auction.baseToken.decimals,
    callback: auction.callbacks,
  });

  return (
    <div>
      <div className="max-w-limit flex gap-x-8">
        <div className="flex flex-grow flex-col justify-between gap-y-4">
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
              <AuctionMetric auction={auction} id="protocolFee" />
              <AuctionMetric auction={auction} id="referrerFee" />
              <AuctionMetric auction={auction} id="minFill" />
              <AuctionMetric auction={auction} id="derivative" />
              <AuctionMetric auction={auction} id="minPrice" />
              <AuctionMetric auction={auction} id="duration" />
            </AuctionMetrics>
          </Card>

          <ProjectInfoCard auction={auction} />
        </div>
        <ClaimCard auction={auction} />
      </div>
      <div></div>
    </div>
  );
}
