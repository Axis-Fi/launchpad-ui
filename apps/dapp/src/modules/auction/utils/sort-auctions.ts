import { AuctionStatus, BaseAuction } from "@repo/types";

const status: { [key in AuctionStatus]: number } = {
  live: 0,
  created: 1,
  concluded: 2,
  decrypted: 3,
  settled: 4,
};

/** Required fields for an auction to be comparable */
type SortableAuction = Pick<BaseAuction, "status">;

/** Sorts an auction by status */
export function sortAuction(a: SortableAuction, b: SortableAuction) {
  return status[a.status] - status[b.status];
}
