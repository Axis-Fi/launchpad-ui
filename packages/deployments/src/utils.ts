import type { Address, Token } from "@repo/types";
import { type AxisDeployment, mainnetDeployments, testnetDeployments } from "."

const isTestnet = (chainId: number): boolean =>
  testnetDeployments.find((testnet) => testnet.chain.id === chainId) !== undefined; 

const getMainnetDeployment = (chainId: number): AxisDeployment | undefined => {
  return mainnetDeployments.find((mainnet) => mainnet.chain.id === chainId);
}

const getMainnetNameFromTestnet = (tokenSymbol: string): string | undefined => {
  const token = getAnyMainnetTokenBySymbol(tokenSymbol);
  
  if (token === undefined) {
    return undefined;
  }

  return getMainnetName(token.chainId);
}

const getMainnetName = (chainId: number): string | undefined => {
  return getMainnetDeployment(chainId)?.chain.name;
}

const getAnyMainnetTokenBySymbol = (tokenSymbol: string): Token | undefined => {
  return mainnetDeployments
    .flatMap(deployment => deployment.tokenList.tokens)
    .find(token => token.symbol === tokenSymbol);
}

const getAnyMainnetTokenAddressBySymbol = (
  tokenSymbol: string
): Address | undefined  => {
  return getAnyMainnetTokenBySymbol(tokenSymbol)?.address;
}

const getMainnetTokenAddress = (chainId: number, tokenSymbol: string): Address | undefined => {
  const mainnetDeployment = getMainnetDeployment(chainId);
  return mainnetDeployment?.tokenList.tokens.find(token => token.symbol === tokenSymbol)?.address;
}

export {
  isTestnet,
  getAnyMainnetTokenAddressBySymbol,
  getMainnetDeployment,
  getMainnetName,
  getMainnetTokenAddress,
  getMainnetNameFromTestnet,
}
