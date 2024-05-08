import type { Token } from "@repo/types";
import { testnetDeployments } from ".";
import mainnetTokenList from "./mainnet-tokenlist.json";

const isTestnet = (chainId: number): boolean =>
  testnetDeployments.find((testnet) => testnet.chain.id === chainId) !==
  undefined;

const mainnetTokens = mainnetTokenList.tokens;

const getMainnetTokenFromSymbol = (tokenSymbol: string): Token | undefined => {
  return mainnetTokens.find((token) => token.symbol === tokenSymbol) as
    | Token
    | undefined;
};

export { isTestnet, getMainnetTokenFromSymbol };
