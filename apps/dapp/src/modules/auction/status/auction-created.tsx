import { InfoLabel, trimAddress } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { PropsWithAuction } from "@repo/types";
import { AuctionInputCard } from "../auction-input-card";

export function AuctionCreated({ auction }: PropsWithAuction) {
  return (
    <div className="flex justify-between">
      <div className="w-1/2">
        <AuctionInfoCard>
          <InfoLabel
            label="Capacity"
            value={`${auction.formatted?.capacity} ${auction.baseToken.symbol}`}
          />
          <InfoLabel label="Creator" value={trimAddress(auction.owner)} />
          <InfoLabel label="Ends in" value={auction.formatted?.endDistance} />
        </AuctionInfoCard>
      </div>

      <div className="w-[40%]">
        <AuctionInputCard auction={auction} submitText="">
          <h3 className="text-center">
            Auction starts in {auction.formatted?.startDistance} at{" "}
            {auction.formatted?.startFormatted}.
          </h3>
        </AuctionInputCard>
      </div>
    </div>
  );
}
