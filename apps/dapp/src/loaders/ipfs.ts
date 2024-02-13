import PinataClient from "@pinata/sdk";

let pinataClient: PinataClient;

function getPinataClient() {
  if (!pinataClient) {
    if (!import.meta.env.VITE_PINATA_JWT_KEY) {
      throw new Error("Missing VITE_PINATA_JWT_KEY");
    }

    // TODO shift behind API or domain-lock
    pinataClient = new PinataClient({
      pinataJWTKey: import.meta.env.VITE_PINATA_JWT_KEY,
    });
  }

  return pinataClient;
}

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
  if (!import.meta.env.VITE_PINATA_GATEWAY) {
    throw new Error("Missing VITE_PINATA_GATEWAY");
  }

  // Replace the trailing slash in the URL
  const gateway =
    import.meta.env.VITE_PINATA_GATEWAY[
      import.meta.env.VITE_PINATA_GATEWAY.length - 1
    ] === "/"
      ? import.meta.env.VITE_PINATA_GATEWAY.slice(0, -1)
      : import.meta.env.VITE_PINATA_GATEWAY;

  const response = await fetch(`${gateway}/ipfs/${address}`);

  return await response.json();
}
