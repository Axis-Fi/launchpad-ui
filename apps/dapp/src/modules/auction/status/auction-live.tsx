import { PropsWithAuction } from "@repo/types";
import { AuctionCoreMetrics } from "../auction-core-metrics";
import { AuctionPurchase } from "../auction-purchase";

export function AuctionLive({ auction }: PropsWithAuction) {
  return (
    <div className="auction-action-container">
      <div className="mt-4 space-y-4 lg:mt-0 lg:w-2/3">
        <AuctionCoreMetrics auction={auction} />
      </div>

      <div className="lg:w-1/3">
        <AuctionPurchase auction={auction} />
      </div>
    </div>
  );
}
