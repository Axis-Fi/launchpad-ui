import { AuctionStatus, RawSubgraphAuction } from "@repo/types";

/** Determines Auction status */
export function getAuctionStatus(auction: RawSubgraphAuction): AuctionStatus {
  const { start, conclusion, capacity } = auction;
  const isConcluded =
    Date.now() > new Date(Number(conclusion) * 1000).getTime();

  if ("bids" in auction) {
    const { bids, bidsDecrypted, bidsRefunded } = auction;

    const isSettled = !!auction.settled;
    // If the auction is settled, it is settled
    if (isSettled) {
      return "settled";
    }
    if (
      isConcluded &&
      bids.length > 0 &&
      bids.length === bidsDecrypted.length + bidsRefunded.length
    ) {
      return "decrypted";
    }
  }

  // If concluded and the number of bids is equal to the number of decrypted bids, the auction is decrypted

  // If capacity is 0, the auction is finished
  if (Number(capacity) == 0) {
    return "concluded";
  }

  // If before the start date, the auction has been created but is not live
  if (Date.now() < new Date(Number(start) * 1000).getTime()) {
    return "created";
  }

  // If after the conclusion date, the auction is concluded
  if (isConcluded) {
    return "concluded";
  }

  return "live";
}
