import { BidList } from "./bid-list";
import { PropsWithAuction } from "@repo/types";
import { Card } from "@repo/ui";

type AuctionBidsCard = {
  isLoading?: boolean;
  address?: `0x${string}`;
} & React.HTMLAttributes<HTMLDivElement> &
  PropsWithAuction;

export function AuctionBidsCard({ auction, ...props }: AuctionBidsCard) {
  return (
    <Card {...props} title={"Bid History"}>
      <BidList auction={auction} />
    </Card>
  );
}
