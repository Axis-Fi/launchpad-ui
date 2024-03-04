import { BidList } from "./bid-list";
import { PropsWithAuction } from "@repo/types";

type AuctionBidsCard = {
  isLoading?: boolean;
  address?: `0x${string}`;
} & React.HTMLAttributes<HTMLDivElement> &
  PropsWithAuction;

export function AuctionBidsCard({
  auction,
  address,
  ...props
}: AuctionBidsCard) {
  return (
    <div {...props}>
      <h3>Bids</h3>
      <div className="mt-2">
        <BidList auction={auction} address={address} />
      </div>
    </div>
  );
}
