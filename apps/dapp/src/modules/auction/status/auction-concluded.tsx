import type { Auction } from "src/types";
import { useDecryptBids } from "../use-decrypt-bids";
import { AuctionInputCard } from "../auction-input-card";
import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { formatDistanceToNow } from "date-fns";

export function AuctionConcluded({ auction }: { auction: Auction }) {
  const decrypt = useDecryptBids(auction);

  const totalRaised = auction.purchased; //TODO: doublecheck subgraph;
  const totalBids = 42069;
  const distance = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  return (
    <div>
      <div className="flex justify-between">
        <AuctionInfoCard className="w-1/2">
          <InfoLabel label="Total Bids" value={totalBids} />
          <InfoLabel
            label="Total Raised"
            value={totalRaised + " " + auction.baseToken.symbol}
          />
          <InfoLabel label="Ended" value={`${distance} ago`} />
        </AuctionInfoCard>
        <div className="w-[40%]">
          <AuctionInputCard
            onClick={decrypt.handleDecryption}
            submitText="Decrypt"
            auction={auction}
          >
            <div className="bg-secondary text-foreground flex justify-center gap-x-2 rounded-sm p-4">
              <div>
                <h1 className="text-4xl">{decrypt.bidsLeft}</h1>
                <p>Bids left</p>
              </div>

              <p className="text-6xl">/</p>

              <div>
                <h1 className="text-4xl">{decrypt.totalBids}</h1>
                <p>Total Bids</p>
              </div>
            </div>
          </AuctionInputCard>
        </div>
      </div>
    </div>
  );
}
