import { useSearchParams } from "react-router-dom";
import { Address, isAddress } from "viem";

/** Checks if exists and returns a URL param named referrer*/
export function useReferral() {
  // Get search params from the URL
  const [searchParams] = useSearchParams();

  // Get the referrer from the search params, if it exists
  let referrer = searchParams.get("ref");
  referrer = referrer ? referrer : "";

  // Parse the referrer into an address, otherwise the referrer is the zero address
  // TODO support address lookup from ENS name in referral?
  const referrerAddress: Address = isAddress(referrer)
    ? referrer
    : "0x0000000000000000000000000000000000000000";

  return referrerAddress;
}
