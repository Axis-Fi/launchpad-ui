import type { Address, Auction } from "@repo/types";
import { isAddress, zeroAddress } from "viem";
import { axisContracts } from "@repo/deployments";
import { allowedCurators, environment } from "@repo/env";

/** Checks if the curator address on an Auction exists in an address list */
export function isAllowedCurator(auction: AuctionProps) {
  const curator = auction.curator;

  if (auction.status === "registering") return true;

  return (
    curator &&
    isAddress(curator) &&
    allowedCurators
      .map((c) => c.address.toLowerCase())
      .includes(curator.toLowerCase())
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
type AuctionProps = Pick<Auction, "status" | "chainId" | "curator"> & {
  callbacks?: Address;
};
export function isSecureAuction(auction: AuctionProps) {
  return Boolean(!environment.isProduction || isAllowedCurator(auction));
}
