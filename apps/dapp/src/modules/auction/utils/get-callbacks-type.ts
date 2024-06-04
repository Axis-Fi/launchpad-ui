import { Auction, CallbacksType } from "@repo/types";
import { axisContracts } from "@repo/deployments";
import { zeroAddress } from "viem";

export function getCallbacksType(auction: Auction): CallbacksType {
  // If no callback is set, return none
  if (!auction.callbacks || auction.callbacks === zeroAddress) {
    return CallbacksType.NONE;
  }

  // Load the chain addresses
  const chainAddresses = axisContracts.addresses[auction.chainId];

  // Check if the callback address on the auction matches one of the first-party callbacks
  // Otherwise, return custom (which isn't supported)
  switch (auction.callbacks) {
    case chainAddresses.merkleAllowlist:
      return CallbacksType.MERKLE_ALLOWLIST;
    case chainAddresses.cappedMerkleAllowlist:
      return CallbacksType.CAPPED_MERKLE_ALLOWLIST;
    case chainAddresses.allocatedMerkleAllowlist:
      return CallbacksType.ALLOCATED_MERKLE_ALLOWLIST;
    case chainAddresses.tokenAllowlist:
      return CallbacksType.TOKEN_ALLOWLIST;
    default:
      return CallbacksType.CUSTOM;
  }
}
