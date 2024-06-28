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
  // Convert to lower case to avoid comparison of checksummed vs. non-checksummed addresses
  switch (auction.callbacks.toLowerCase()) {
    case chainAddresses.merkleAllowlist.toLowerCase():
      return CallbacksType.MERKLE_ALLOWLIST;
    case chainAddresses.cappedMerkleAllowlist.toLowerCase():
      return CallbacksType.CAPPED_MERKLE_ALLOWLIST;
    case chainAddresses.allocatedMerkleAllowlist.toLowerCase():
      return CallbacksType.ALLOCATED_MERKLE_ALLOWLIST;
    case chainAddresses.tokenAllowlist.toLowerCase():
      return CallbacksType.TOKEN_ALLOWLIST;
    case chainAddresses.uniV2Dtl.toLowerCase():
      return CallbacksType.UNIV2_DTL;
    case chainAddresses.uniV3Dtl.toLowerCase():
      return CallbacksType.UNIV3_DTL;
    default:
      return CallbacksType.CUSTOM;
  }
}
