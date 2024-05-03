import { BidList } from "./bid-list";
import { AtomicAuction, AuctionType, PropsWithAuction } from "@repo/types";
import { PurchaseList } from "./purchase-list";

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
  const isFixedPrice = auction.auctionType === AuctionType.FIXED_PRICE;

  return (
    <div {...props}>
      <h3>Bids</h3>
      <div className="mt-2">
        {isFixedPrice ? (
          <PurchaseList auction={auction as AtomicAuction} />
        ) : (
          <BidList auction={auction} address={address} />
        )}
      </div>
    </div>
  );
}
