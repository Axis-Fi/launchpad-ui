import PinataClient from "@pinata/sdk";
import { z } from "zod";

let pinataClient: PinataClient;

function getPinataClient() {
  if (!pinataClient) {
    if (!process.env.VITE_PINATA_JWT_KEY) {
      throw new Error("Missing VITE_PINATA_JWT_KEY");
    }

    pinataClient = new PinataClient({
      pinataJWTKey: process.env.VITE_PINATA_JWT_KEY,
    });
  }

  return pinataClient;
}

export const auctionInfoType = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  links: z.record(z.string().optional()).optional(),
});

/**
 * Stores the given object in IPFS
 *
 * @param object
 * @returns
 */
export async function storeData(object: unknown): Promise<string> {
  const client = getPinataClient();

  const response = await client.pinJSONToIPFS(object);

  const dataAddress = response.IpfsHash;

  return dataAddress;
}

/**
 * Fetches the object from IPFS
 *
 * @param address
 * @returns
 */
export async function getData(address: string): Promise<unknown> {
  const gateway = process.env.VITE_PINATA_GATEWAY;
  if (!gateway) {
    throw new Error("Missing VITE_PINATA_GATEWAY");
  }

  // Replace the trailing slash in the URL
  const gatewayClean =
    gateway[gateway.length - 1] === "/" ? gateway.slice(0, -1) : gateway;

  const response = await fetch(`${gatewayClean}/ipfs/${address}`);

  return await response.json();
}
