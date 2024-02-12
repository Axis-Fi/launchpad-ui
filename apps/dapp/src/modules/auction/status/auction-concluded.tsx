import type { Auction } from "src/types";
import { useDecryptBids } from "../use-decrypt-bids";
import { AuctionInputCard } from "../auction-input-card";
import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";

export function AuctionConcluded({ auction }: { auction: Auction }) {
  const decrypt = useDecryptBids(auction);

  const finalExchangeRate = 0.5; //TODO: include
  const totalRaised = auction.purchased; //TODO: doublecheck subgraph;

  return (
    <div className="flex justify-between">
      <AuctionInfoCard className="w-1/2">
        <InfoLabel
          label="Final Auction Price"
          value={`${finalExchangeRate} ${auction.quoteToken.symbol}/${auction.baseToken.symbol}`}
        />

        <InfoLabel label="Total Raised" value={`$${totalRaised}`} />
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
  );
}
