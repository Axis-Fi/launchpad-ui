import { Address } from "@repo/types";

type PartialTokenResponse = { coins: { [key: string]: { price: number } } };

const fetchTokenPrices = async (
  mainnetName: string,
  tokenAddresses: Address[],
): Promise<number[]> => {
  if (!mainnetName) {
    throw new Error("mainnetName is required");
  }
  if (!tokenAddresses || tokenAddresses?.length === 0) {
    throw new Error("tokenAddresses is required");
  }

  const mainnetNameLowerCase = mainnetName.toLowerCase();
  const tokenUrlQuery = `${mainnetNameLowerCase}:${tokenAddresses.join(`,${mainnetNameLowerCase}:`)}`;
   // TODO get url from env config
  const response = await fetch(`https://coins.llama.fi/prices/current/${tokenUrlQuery}?searchWidth=1h`);
  const json = await response.json() as PartialTokenResponse;
  const tokenPrices = Object.values(json?.coins).map((token) => token?.price);

  return tokenPrices;
}

export {
  fetchTokenPrices,
}