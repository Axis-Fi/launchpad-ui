import { BidList } from "./bid-list";
import { AtomicAuction, AuctionType, PropsWithAuction } from "@repo/types";
import { PurchaseList } from "./purchase-list";
import { Card } from "@repo/ui";

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
    <Card {...props}>
      {isFixedPrice ? <h3>Purchases</h3> : <h3>Bids</h3>}
      <div className="mt-2">
        {isFixedPrice ? (
          <PurchaseList auction={auction as AtomicAuction} />
        ) : (
          <BidList auction={auction} address={address} />
        )}
      </div>
    </Card>
  );
}
