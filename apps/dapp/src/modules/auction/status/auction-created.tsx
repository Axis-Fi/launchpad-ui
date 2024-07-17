import { Card, Text } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { AuctionLaunchMetrics } from "../auction-launch-metrics";
import { ProjectInfoCard } from "../project-info-card";

export function AuctionCreated({ auction }: PropsWithAuction) {
  return (
    <div className="auction-action-container h-full items-stretch gap-x-4 lg:block">
      <div className="lg:w-2/3 ">
        <AuctionLaunchMetrics auction={auction} />
        <ProjectInfoCard className="mt-4" auction={auction} />
      </div>
      <div className="items-strech h-full lg:w-1/3">
        <Card>
          <Text className="text-center text-lg lg:text-sm">
            Auction starts in {auction.formatted?.startDistance} <br />
            at {auction.formatted?.startFormatted}.
          </Text>
        </Card>
      </div>
    </div>
  );
}
