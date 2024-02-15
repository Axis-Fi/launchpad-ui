import { InfoLabel, trimAddress } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { PropsWithAuction } from "..";
import { AuctionInputCard } from "../auction-input-card";
import { formatDate } from "../../../utils/date";
import { formatDistanceToNow } from "date-fns";

export function AuctionCreated({ auction }: PropsWithAuction) {
  const startDate = new Date(Number(auction.start) * 1000);
  const startFormatted = formatDate.fullLocal(startDate);
  const startDistance = formatDistanceToNow(startDate);

  const endDate = new Date(Number(auction.conclusion) * 1000);
  const endDistance = formatDistanceToNow(endDate);

  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionInfoCard>
          <InfoLabel
            label="Capacity"
            value={`${auction.capacity} ${auction.baseToken.symbol}`}
          />
          <InfoLabel label="Creator" value={trimAddress(auction.owner)} />
          <InfoLabel label="Ends in" value={endDistance} />
        </AuctionInfoCard>
      </div>

      <div className="w-[40%]">
        {/* @ts-expect-error TODO: expect type mismatch */}
        <AuctionInputCard auction={auction} submitText="">
          <h3 className="text-center">
            Auction starts in {startDistance} at {startFormatted}.
          </h3>
        </AuctionInputCard>
      </div>
    </div>
  );
}
