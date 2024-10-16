import { Auction } from "@repo/types";
import { getPrice } from "./auction-details";
import { getMinRaiseForAuction, getTargetRaise } from "../auction-metric";

export function calculateAuctionProgress(auction: Auction) {
  const currentAmount = auction.bids.reduce((total, b) => {
    total += Number(b.amountIn);
    return total;
  }, 0);

  const minRaise = getMinRaiseForAuction(auction) ?? 0;
  const targetAmount = getTargetRaise(auction, getPrice(auction)) ?? 0;

  const minTarget = Math.round((minRaise / targetAmount) * 100);
  const current = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100,
  );

  return {
    /** The current percentual progress of an auction's raise*/
    current,
    /** The minimum percentual target raise of an auction*/
    minTarget,
    targetAmount,
  };
}
