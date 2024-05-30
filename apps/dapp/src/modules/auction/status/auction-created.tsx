import { Card, Text } from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { AuctionLaunchMetrics } from "../auction-launch-metrics";

export function AuctionCreated({ auction }: PropsWithAuction) {
  return (
    <div className="flex h-full items-stretch justify-between gap-x-4">
      <AuctionLaunchMetrics className="w-2/3" auction={auction} />

      <div className="items-strech h-full w-1/3">
        <Card>
          <Text size="2xl" className="text-center">
            Auction starts in {auction.formatted?.startDistance} <br />
            at {auction.formatted?.startFormatted}.
          </Text>
        </Card>
      </div>
    </div>
  );
}
