import { AuctionStatus, SubgraphAuction } from "@repo/types";

/**
 * Determines the auction status dynamically.
 * The subgraph doesn't receive an event when an auction starts or concludes, so
 * we need to derive this on the frontend.
 * @param auction
 * @returns
 */
export function getAuctionStatus(auction: SubgraphAuction): AuctionStatus {
  const { start, conclusion } = auction;

  const isConcluded =
    Date.now() > new Date(Number(conclusion) * 1000).getTime();

  const isLive =
    !isConcluded && Date.now() > new Date(Number(start) * 1000).getTime();

  const subgraphStatus = (
    auction?.encryptedMarginalPrice?.status || auction?.fixedPrice?.status
  )?.toLowerCase();

  // All auctions are "live" once their start time has passed
  if (subgraphStatus === "created" && isLive) return "live";

  // An EMP auction could be past its conclusion date and not yet decrypted
  if (subgraphStatus === "created" && isConcluded) return "concluded";

  return subgraphStatus as AuctionStatus;
}
