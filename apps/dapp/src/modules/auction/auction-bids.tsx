import { BidList } from "./bid-list";
import { PropsWithAuction } from ".";

type AuctionBidsCard = {
  isLoading?: boolean;
} & React.HTMLAttributes<HTMLDivElement> &
  PropsWithAuction;

export function AuctionBidsCard({
  auction,
  isLoading,
  ...props
}: AuctionBidsCard) {
  // TODO: implement bids card
  // - table of bids
  // - bidder
  // - quote token amount
  // - "encrypted" base token amount out for each bid (skeleton?)
  // - reveal the decrypted base token amount if there is a matching decrypted bid
  // - display if the bid is refunded (search for it in the refundedBids prop using the bidId)

  return (
    <div {...props}>
      <h3>Bids</h3>
      <div className="mt-2">
        <BidList auction={auction} />
      </div>
    </div>
  );
}
