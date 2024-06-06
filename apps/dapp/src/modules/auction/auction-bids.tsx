import { BidList } from "./bid-list";
import { AtomicAuction, AuctionType, PropsWithAuction } from "@repo/types";
import { PurchaseList } from "./purchase-list";
import { Card } from "@repo/ui";

type AuctionBidsCard = {
  isLoading?: boolean;
  address?: `0x${string}`;
} & React.HTMLAttributes<HTMLDivElement> &
  PropsWithAuction;

export function AuctionBidsCard({ auction, ...props }: AuctionBidsCard) {
  const isFixedPrice = auction.auctionType === AuctionType.FIXED_PRICE;

  return (
    <Card {...props} title={isFixedPrice ? "Purchases" : "Bid History"}>
      {isFixedPrice ? (
        <PurchaseList auction={auction as AtomicAuction} />
      ) : (
        <BidList auction={auction} />
      )}
    </Card>
  );
}
