import React from "react";
import { useSearchParams } from "react-router-dom";
import { useSetReferrer } from "state/referral";
import { Address, isAddress } from "viem";

function undoUrlSafe(safeB64Str: string) {
  return safeB64Str.replace(/-/g, "+").replace(/_/g, "/").replace(/~/g, "=");
}

function binaryToHex(bin: string) {
  const hex = [];
  let d;
  let h;
  for (let i = 0; i < bin.length; i++) {
    d = bin.charCodeAt(i);
    h = d.toString(16);
    hex.push(h);
  }

  return hex.join("");
}

/** Checks if exists and returns a URL param named referrer*/
export function ReferrerChecker() {
  // Get search params from the URL
  const [searchParams] = useSearchParams();
  const setReferrer = useSetReferrer();

  // Get the referrer from the search params, if it exists
  const encodedReferrer: string = searchParams.get("ref") ?? "";

  // Undo safe URL conversions
  const encoded = undoUrlSafe(encodedReferrer);

  // Decode the encoding to binary
  const bin = atob(encoded);

  // Convert the binary to a hex string and prefix with 0x
  const referrer: string = "0x" + binaryToHex(bin);

  // TODO convert to checksummed address?

  // Parse the referrer into an address, otherwise the referrer is the zero address
  // TODO support address lookup from ENS name in referral?
  const referrerAddress: Address | null = isAddress(referrer) ? referrer : null;

  React.useEffect(() => {
    if (referrerAddress) setReferrer(referrerAddress);
  }, [referrerAddress, setReferrer]);

  return null;
}
