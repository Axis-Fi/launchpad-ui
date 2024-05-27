import { Auction } from "@repo/types";

export function calculateAuctionProgress(
  auction: Auction,
  current = new Date().getTime() / 1000,
) {
  const { start, conclusion } = auction;
  return (
    ((Number(current) - Number(start)) / (Number(conclusion) - Number(start))) *
    100
  );
}
