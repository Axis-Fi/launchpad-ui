import type { Address, Auction } from "@repo/types";
import { isAddress, zeroAddress } from "viem";
import { axisContracts } from "@repo/deployments";
import {
  allowedCuratorAddresses,
  allowedCurators,
  environment,
} from "@repo/env";

/** Checks if the curator address on an Auction exists in an address list */
export function isAllowedCurator(auction: AuctionProps) {
  const curator = auction.curator;

  if (auction.status === "registering") return true;

  return (
    curator &&
    isAddress(curator) &&
    allowedCuratorAddresses.includes(curator.toLowerCase() as Address)
  );
}

/** Checks if a callback address is a valid Axis Contract */
export function isAxisCallback(auction: AuctionProps) {
  return (
    !auction.callbacks ||
    auction.callbacks === zeroAddress ||
    Object.values(axisContracts.addresses[auction.chainId])
      .map((c) =>
        typeof c === "string" ? c.toLowerCase() : c.map((c) => c.toLowerCase()),
      )
      .includes(auction.callbacks.toLowerCase())
  );
}

/** Calls auction filters */
type AuctionProps = Pick<Auction, "status" | "chainId" | "curator" | "id"> & {
  callbacks?: Address;
};

export function isSecureAuction(auction: AuctionProps) {
  return Boolean(!environment.isProduction || isAllowedCurator(auction));
}

// These baseline launches weren't curator approved at the contract level
// however they are legit and we're forcing them to be displayed as such
const PREVIOUS_BASELINE_AUCTION_IDS = [
  "blast-0xba000055df41da8584e1251bcdf45e91acb61108-1",
  "blast-0xba000055df41da8584e1251bcdf45e91acb61108-2",
];

/**
 * Validates whether a past auction was a legit baseline auction
 */
export function isPreviousBaselineAuction(
  auction: Pick<Auction, "id" | "curator">,
) {
  const baselineCurator = allowedCurators.find(({ id }) => id === "baseline");
  const addresses = baselineCurator?.address as Address[];

  if (addresses.includes(auction.curator?.toLowerCase() as Address)) {
    const check = PREVIOUS_BASELINE_AUCTION_IDS.includes(
      auction.id.toLowerCase(),
    );
    return check;
  }
}
