import { AuctionStatus, SubgraphAuction } from "@repo/types";

/** Determines Auction status */
export function getAuctionStatus(auction: SubgraphAuction): AuctionStatus {
  const { start, conclusion, capacity } = auction;
  const isConcluded =
    Date.now() > new Date(Number(conclusion) * 1000).getTime();

  if ("bids" in auction) {
    const { bids, capacity } = auction; // TODO subgraph was not returning correct values for bidsDecrypted and bidsRefunded

    // bids implies batch auction
    // if a batch auction has a capacity of zero, it means it was cancelled before it started
    if (Number(capacity) == 0) {
      return "cancelled";
    }

    const numBids = bids.length;
    const numBidsDecrypted = bids.filter(
      (b) => b.status === "decrypted",
    ).length;
    const numBidsClaimed = bids.filter((b) => b.status === "claimed").length;

    const isSettled = !!auction.settled;
    // If the auction is settled, it is settled
    if (isSettled) {
      return "settled";
    }

    // Check if auction has been fully decrypted
    // TODO: Doesn't work for auctions that end with 0 total bids
    if (
      isConcluded &&
      numBids > 0 &&
      numBids === numBidsDecrypted + numBidsClaimed
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
