import { Card } from "@repo/ui";
import { AuctionMetrics } from "../auction-metrics";
import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { AuctionMetric } from "../auction-metric";
import { SettledAuctionCard } from "modules/auction/settled-auction-card";
import { ProjectInfoCard } from "../project-info-card";
import { ClaimCard } from "../claim-card";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;

  return (
    <div className="flex flex-row gap-x-[32px]">
      <div className="flex flex-grow flex-col justify-between gap-y-[16px]">
        {isEMP && <SettledAuctionCard auction={auction as BatchAuction} />}

        <Card title="Launch Info">
          <AuctionMetrics>
            <AuctionMetric auction={auction} id="protocolFee" />
            <AuctionMetric auction={auction} id="minFill" />
            <AuctionMetric auction={auction} id="derivative" />
            <AuctionMetric auction={auction} id="referrerFee" />
            <AuctionMetric auction={auction} id="minPrice" />
            <AuctionMetric auction={auction} id="duration" />
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
