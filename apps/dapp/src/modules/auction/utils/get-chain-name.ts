import type { Chain } from "viem";

const getChainName = (chain: Chain) => {
  return chain.name.toLowerCase().replace(" ", "-");
};

export { getChainName };
