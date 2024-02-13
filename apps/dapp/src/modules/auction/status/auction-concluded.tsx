import { useDecryptBids } from "../use-decrypt-bids";
import { AuctionInputCard } from "../auction-input-card";
import { InfoLabel } from "@repo/ui";
import { AuctionInfoCard } from "../auction-info-card";
import { formatDistanceToNow } from "date-fns";
import { PropsWithAuction } from "..";

export function AuctionConcluded({ auction }: PropsWithAuction) {
  const decrypt = useDecryptBids(auction);

  const totalBids = auction?.bids.length;
  const totalBidAmount = auction.bids?.reduce(
    (total, b) => total + Number(b.amount),
    0,
  );
  const distance = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  return (
    <div>
      <div className="flex justify-between">
        <AuctionInfoCard className="w-1/2">
          <InfoLabel label="Total Bids" value={totalBids} />
          <InfoLabel
            label="Total Bid Amount"
            value={totalBidAmount + " " + auction.quoteToken.symbol}
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

          {decrypt.decryptTx.isPending && <p>Confirming transaction...</p>}
          {decrypt.decryptTx.isError && (
            <p>{decrypt.decryptTx.error?.message}</p>
          )}
          {decrypt.decryptTx.isSuccess && <p>Success!</p>}
        </div>
      </div>
    </div>
  );
}
