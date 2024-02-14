import { Chain } from "viem";

export const getBlockExplorer = (chain: Chain) => {
  return {
    name: chain.blockExplorers?.default.name,
    url: chain.blockExplorers?.default.url + "/address/",
    baseUrl: chain.blockExplorers?.default.url,
  };
};
