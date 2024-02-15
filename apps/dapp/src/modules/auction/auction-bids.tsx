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
  return (
    <div {...props}>
      <h3>Bids</h3>
      <div className="mt-2">
        <BidList auction={auction} />
      </div>
    </div>
  );
}
