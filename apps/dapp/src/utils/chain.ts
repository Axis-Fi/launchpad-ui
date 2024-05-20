import { chains } from "@repo/env";
import { Chain } from "@repo/types";

const activeChains = chains.activeChains;

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

export function getChainById(chainId: number): Chain {
  const chain = activeChains.find((c) => c.id === chainId);
  if (!chain) throw new Error(`Unable to find chain ${chainId}`);
  return chain;
}
