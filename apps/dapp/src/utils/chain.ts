import { activeChains } from "config/chains";
import { Chain } from "viem";

export const getBlockExplorer = (chain: Chain) => {
  return {
    name: chain.blockExplorers?.default.name,
    url: chain.blockExplorers?.default.url + "/address/",
    baseUrl: chain.blockExplorers?.default.url,
  };
};

//TODO: see if possible map chains to viem defs in subgraph
const chainMap: Record<string, string> = {
  "blast-testnet": "blast sepolia",
};

export function getChainId(chainName?: string): number {
  const name = chainMap[chainName ?? ""];

  const chainId = activeChains.find(
    (c) => c.name.toLocaleLowerCase() === name?.toLocaleLowerCase(),
  )?.id;

  if (chainId === undefined) {
    throw new Error(`Chain ${chainName} is not supported`);
  }

  return chainId;
}
