import {
  isTestnet,
  getMainnetName,
  getMainnetTokenAddress,
  getAnyMainnetTokenAddressBySymbol,
  getMainnetNameFromTestnet,
} from "@repo/deployments";
import type { Address } from "@repo/types";
import { fetchTokenPrices } from "../utils";

const getTokenPrices = async (chainId: number, tokenSymbols: string[]): Promise<number[]> => {
  const tokenAddresses = isTestnet(chainId)
    ? tokenSymbols.map((tokenSymbol) => getAnyMainnetTokenAddressBySymbol(tokenSymbol))
    : tokenSymbols.map((tokenSymbol) => getMainnetTokenAddress(chainId, tokenSymbol));

  const allTokensFound = tokenAddresses.every((address): address is Address => address !== undefined);
  
  if (!allTokensFound) {
    throw new Error(`Couldn't find token address for symbol ${tokenSymbols[tokenAddresses.indexOf(undefined)]}`);
  }

  const mainnetName = isTestnet(chainId) ? getMainnetNameFromTestnet(tokenSymbols[0]) : getMainnetName(chainId);

  if (mainnetName === undefined) {
    throw new Error(`Couldn't find mainnet name for chainId ${chainId}`);
  }
  
  return fetchTokenPrices(mainnetName, tokenAddresses);
}

const getTokenPrice = async (chainId: number, tokenSymbol: string): Promise<number> => {
  const [price] = await getTokenPrices(chainId, [tokenSymbol]);
  return price;
}

export {
  getTokenPrice,
  getTokenPrices,
}