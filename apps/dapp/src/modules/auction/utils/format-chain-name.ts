import type { Chain } from "viem";

const formatChainName = (chain: Chain) => {
  return chain.name.toLowerCase().replace(/ /g, "-");
};

export { formatChainName };
