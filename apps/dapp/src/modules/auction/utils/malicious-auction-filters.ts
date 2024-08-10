import { Auction } from "@repo/types";
import { isAddress } from "viem";
import { axisContracts } from "@repo/deployments";
import { allowedCurators, environment } from "@repo/env";

/** Checks if the curator address on an Auction exists in an address list */
export function isAllowedCurator(auction: Auction) {
  const curator = auction.curator;

  return (
    curator &&
    isAddress(curator) &&
    allowedCurators
      .map((c) => c.address.toLowerCase())
      .includes(curator.toLowerCase())
  );
}

/** Checks if a callback address is a valid Axis Contract */
export function isAxisCallback(auction: Auction) {
  return (
    isAddress(auction.callbacks) &&
    Object.values(axisContracts.addresses[auction.chainId]).includes(
      auction.callbacks,
    )
  );
}

/** Calls auction filters */
export function isSecureAuction(auction: Auction) {
  return Boolean(
    !environment.isProduction ||
      (isAllowedCurator(auction) && isAxisCallback(auction)),
  );
}
