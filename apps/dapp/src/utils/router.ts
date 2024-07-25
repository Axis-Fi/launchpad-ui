import { Auction } from "@repo/types";

/** Contructs the URL path to an auction*/
export function getAuctionPath(auction: Auction) {
  return `${auction.chainId}/${auction.lotId}`;
}
