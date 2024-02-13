import { Skeleton } from "@repo/ui";
import {
  SubgraphAuctionDecryptedBid,
  SubgraphAuctionEncryptedBid,
} from "loaders/subgraphTypes";

type AuctionBidsCard = {
  encryptedBids: SubgraphAuctionEncryptedBid[];
  decryptedBids: SubgraphAuctionDecryptedBid[];
  isLoading?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export function AuctionBidsCard({
  encryptedBids,
  decryptedBids,
  isLoading,
  ...props
}: AuctionBidsCard) {
  // TODO: implement bids card
  // - table of bids
  // - bidder
  // - quote token amount
  // - "encrypted" base token amount out for each bid (skeleton?)
  // - reveal the decrypted base token amount if there is a matching decrypted bid

  return (
    <div {...props}>
      <h3>Bids</h3>
      <div className="mt-2">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          encryptedBids.map((bid) => (
            <div key={bid.bidId} className="flex">
              <p>
                {bid.bidder}: {bid.amount}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
