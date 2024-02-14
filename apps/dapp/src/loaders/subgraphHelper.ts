import { AuctionStatus } from "src/types";

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

export function getStatus(
  start: string,
  conclusion: string,
  capacity: string,
): AuctionStatus {
  // If capacity is 0, the auction is finished
  if (Number(capacity) == 0) {
    return "settled";
  }

  // If before the start date, the auction has been created but is not live
  if (Date.now() < new Date(Number(start) * 1000).getTime()) {
    return "created";
  }

  // If after the conclusion date, the auction is concluded
  if (Date.now() > new Date(Number(conclusion) * 1000).getTime()) {
    return "concluded";
  }

  return "live";
}
