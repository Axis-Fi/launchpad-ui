import { AuctionStatus, Auction } from "@axis-finance/types";

const status: { [key in AuctionStatus]: number } = {
  live: 0,
  created: 1,
  concluded: 2,
  decrypted: 3,
  settled: 4,
  cancelled: 5,
  aborted: 6,
};

/** Required fields for an auction to be comparable */
type SortableAuction = Pick<Auction, "status" | "start">;

/** Sorts an auction by status */
export function sortAuction(a: SortableAuction, b: SortableAuction) {
  if (a.status === b.status) return +b.start - +a.start;

  return status[a.status] - status[b.status];
}
