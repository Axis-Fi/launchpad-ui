// TODO get an exhaustive list of chains
const chainIds: { [chainName: string]: number } = {
  "blast-testnet": 168587773,
};

export function getChainId(chainName: string): number {
  const chainId = chainIds[chainName];
  if (chainId === undefined) {
    throw new Error(`Chain ${chainName} is not supported`);
  }
  return chainId;
}
