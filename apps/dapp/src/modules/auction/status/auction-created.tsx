import { Card, Text } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { AuctionLaunchMetrics } from "../auction-launch-metrics";
import { ProjectInfoCard } from "../project-info-card";

export function AuctionCreated({ auction }: PropsWithAuction) {
  return (
    <div className="auction-action-container h-full items-stretch gap-x-4 lg:flex">
      <div className="lg:w-2/3 ">
        <AuctionLaunchMetrics auction={auction} />
        <ProjectInfoCard className="mt-4" auction={auction} />
      </div>
      <div className="items-strech h-full lg:w-1/3">
        <Card>
          <Text className="lg:text-md text-center text-lg">
            Auction starts in {auction.formatted?.startDistance} <br />
            at {auction.formatted?.startFormatted}.
          </Text>
        </Card>
      </div>
    </div>
  );
}
