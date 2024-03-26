import { activeChains } from "config/chains";
import { Chain } from "@repo/types";

export const getBlockExplorer = (chain: Chain) => {
  return {
    name: chain.blockExplorers?.default.name,
    url: chain.blockExplorers?.default.url + "/",
    baseUrl: chain.blockExplorers?.default.url,
  };
};

export function getChainId(chainName?: string): number {
  const name = chainName?.replace("-", " ").toLowerCase();

  const chainId = activeChains.find(
    (c) => c.name.toLocaleLowerCase() === name?.toLocaleLowerCase(),
  )?.id;

  if (chainId === undefined) {
    throw new Error(`Chain ${chainName} is not supported`);
  }

  return chainId;
}
