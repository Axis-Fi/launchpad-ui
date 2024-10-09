import { AuctionType, PropsWithAuction } from "@repo/types";
import { AuctionCoreMetrics } from "../auction-core-metrics";
import { Card } from "@repo/ui";
import { ProjectInfoCard } from "../project-info-card";
import { AuctionBidInput } from "../auction-bid-input";
import { AuctionBidInputSingle } from "../auction-bid-input-single";

//TODO: create a preview auction type to avoid mismatches
export function AuctionLivePreview({ auction }: PropsWithAuction) {
  const isEMP = auction.auctionType === AuctionType.SEALED_BID;

  return (
    <div className="mt-4 flex justify-between gap-x-8">
      <div className="w-2/3 space-y-4">
        <AuctionCoreMetrics auction={auction} />

        <ProjectInfoCard auction={auction} />
      </div>
      <div className="w-1/3">
        <Card
          title={!isEMP ? `Buy ${auction.baseToken.symbol}` : `Place your bid`}
        >
          {isEMP ? (
            <AuctionBidInput auction={auction} />
          ) : (
            <AuctionBidInputSingle auction={auction} />
          )}
        </Card>
      </div>
    </div>
  );
}
