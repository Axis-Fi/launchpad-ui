import { PropsWithAuction } from "@repo/types";
import { AuctionCoreMetrics } from "../auction-core-metrics";
import { AuctionPurchase } from "../auction-purchase";
import React from "react";
import { cn } from "@repo/ui";

export function AuctionLive({ auction }: PropsWithAuction) {
  const [showMetrics, setShowMetrics] = React.useState(false);

  return (
    <div className="auction-action-container relative transition-all ">
      <div
        className={cn(
          "mt-4 -translate-x-[220%] space-y-4 transition-all duration-500 lg:mt-0 lg:w-2/3",
          showMetrics && "translate-x-0",
        )}
      >
        <AuctionCoreMetrics auction={auction} />
      </div>

      <div
        className={cn(
          "-translate-x-full transition-all duration-500 lg:w-1/3",
          showMetrics && "translate-x-0",
        )}
      >
        <AuctionPurchase
          handleShowMetrics={() => setShowMetrics((prev) => !prev)}
          showMetrics={showMetrics}
          auction={auction}
        />
      </div>
    </div>
  );
}
