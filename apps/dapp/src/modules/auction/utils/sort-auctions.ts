import { AuctionStatus, BaseAuction } from "src/types";

const status: { [key in AuctionStatus]: number } = {
  live: 0,
  created: 1,
  concluded: 2,
  decrypted: 3,
  settled: 4,
};

/** Sorts an auction by status */
export function sortAuction(a: BaseAuction, b: BaseAuction) {
  return status[a.status] - status[b.status];
}
