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
    <div className="flex flex-row gap-x-[32px]">
      <div className="flex flex-grow flex-col justify-between gap-y-[16px]">
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
              // TODO fix alignment of metric title
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

        <ProjectInfoCard auction={auction} />
      </div>
      <div className={"flex w-[496px] items-start"}>
        <ClaimCard auction={auction} />
      </div>
    </div>
  );
}
