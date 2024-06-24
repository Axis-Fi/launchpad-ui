import Storage from "@fleekhq/fleek-storage-js";

/** Stores data and returns the location hash */
export async function storeData(input: {
  data: string;
  key: string;
}): Promise<Storage.uploadOutput> {
  const keys = getCredentials();

  return Storage.upload({ ...keys, ...input });
}

/** Gets the keys required for fleek storage calls */
function getCredentials() {
  if (!process.env.FLEEK_KEY || !process.env.FLEEK_SECRET) {
    throw new Error("Missing Fleek credentials");
  }

  return {
    apiKey: process.env.FLEEK_KEY!,
    apiSecret: process.env.FLEEK_SECRET!,
  };
}
