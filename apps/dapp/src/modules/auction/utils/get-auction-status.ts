import type { AuctionStatus, Auction } from "@axis-finance/types";

/**
 * Determines the auction status dynamically.
 * The subgraph doesn't receive an event when an auction starts or concludes, so
 * we need to derive this on the frontend.
 */
type AuctionLike = Partial<
  Pick<
    Auction,
    "start" | "conclusion" | "encryptedMarginalPrice" | "fixedPrice"
  >
>;

export function getAuctionStatus(auction: AuctionLike): AuctionStatus {
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
