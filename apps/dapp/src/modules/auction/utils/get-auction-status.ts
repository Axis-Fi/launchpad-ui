import {
  AuctionData,
  AuctionStatus,
  EMPAuctionData,
  SubgraphAuction,
} from "@repo/types";

enum LotContractStatus {
  Created,
  Decrypted,
  Settled,
}

/** Determines Auction status */
export function getAuctionStatus(
  auction: SubgraphAuction,
  auctionData?: AuctionData,
): AuctionStatus {
  const { start, conclusion, capacity } = auction;
  const isConcluded =
    Date.now() > new Date(Number(conclusion) * 1000).getTime();

  if ("bids" in auction) {
    const status = (auctionData as EMPAuctionData)?.status;
    const { capacity } = auction;

    // bids implies batch auction
    // if a batch auction has a capacity of zero, it means it was cancelled before it started
    if (Number(capacity) == 0) {
      return "cancelled";
    }

    // TODO: probably redudant but verify
    if (!!auction.settled || status === LotContractStatus.Settled) {
      return "settled";
    }

    // Check if auction has been fully decrypted
    // TODO: Doesn't work for auctions that end with 0 total bids
    if (status === LotContractStatus.Decrypted) {
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
