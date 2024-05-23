import { Address, Auction } from "@repo/types";
import { useFees } from "./use-fees";
import { useCuratorFees } from "./use-curator-fees";

/** Utilities to handle the current fees for a given Auction */
export function useAuctionFees(auction: Auction) {
  const { data: currentFees } = useFees(
    auction.chainId,
    auction.auctionHouse as Address,
    auction.auctionType,
  );

  const { fee } = useCuratorFees(auction.chainId, auction.auctionType);

  const currentFee = [currentFees.protocol, currentFees.referrer, fee].reduce(
    (total = 0, fee) => (total += fee ?? 0),
    0,
  );

  /** Subtracts the current total fee (referrer + curator + protocol)
   * from a given amount */
  const subtractFee = (amount: number) =>
    amount * ((100 - (currentFee ?? 0)) / 100);

  return {
    currentFee,
    subtractFee,
  };
}
