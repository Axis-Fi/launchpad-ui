import { type Hex, toHex } from "viem";
import { MetadataClient } from "@repo/ipfs-api";
import { AuctionMetadata } from "./types";

/** Converts a Date to a Unix timestamp (seconds) */
export const getTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);

export const toKeycode = (keycode: string): Hex => {
  return toHex(keycode, { size: 5 });
};

export const storeMetadata = async (
  metadata: AuctionMetadata,
  metadataClient: MetadataClient,
): Promise<string> => {
  const response = await metadataClient.storeAuctionInfo.mutate(metadata);

  return response.hash.hashV0;
};
