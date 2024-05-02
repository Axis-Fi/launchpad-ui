import { RawSubgraphAuction } from "@repo/types";
import { environment } from "@repo/env";

const devAddresses = [
  "0xb47c8e4beb28af80ede5e5bf474927b110ef2c0e",
  "0x62A665d3f9fc9a968dC35a789122981d9109349a",
].map((a) => a.toLowerCase());

export function filterDevAddressesOnTestnet(a: RawSubgraphAuction) {
  return (
    environment.isDevelopment || !devAddresses.includes(a.owner.toLowerCase())
  );
}
