import { AuctionType, BatchAuction, PropsWithAuction } from "@repo/types";
import { SettledAuctionCard } from "modules/auction/settled-auction-card";
import { ProjectInfoCard } from "../project-info-card";
import { ClaimCard } from "../claim-card";
import { TokenInfoCard } from "../token-info-card";
import { AuctionCoreMetrics } from "../auction-core-metrics";

export function AuctionSettled({ auction }: PropsWithAuction) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;

  return (
    <div className="auction-action-container">
      <div className="mt-4 space-y-4 lg:mt-0 lg:w-2/3">
        {isEMP && <SettledAuctionCard auction={auction as BatchAuction} />}
        <AuctionCoreMetrics auction={auction} />
        <TokenInfoCard auction={auction} />
        <ProjectInfoCard auction={auction} />
      </div>
      <ClaimCard auction={auction} />
    </div>
  );
}
