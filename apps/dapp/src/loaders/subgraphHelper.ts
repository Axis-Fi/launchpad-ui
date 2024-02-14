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

export function getAuctionStatus(
  start: string,
  conclusion: string,
  capacity: string,
): AuctionStatus {
  return getAuctionStatusWithBids(start, conclusion, capacity, false, 0, 0, 0);
}

export function getAuctionStatusWithBids(
  start: string,
  conclusion: string,
  capacity: string,
  settled: boolean,
  bids: number,
  bidsDecrypted: number,
  refundedBids: number,
): AuctionStatus {
  // If the auction is settled, it is settled
  if (settled) {
    return "settled";
  }

  // If the number of bids is equal to the number of decrypted bids, the auction is decrypted
  if (bids > 0 && bids === bidsDecrypted + refundedBids) {
    return "decrypted";
  }

  // If capacity is 0, the auction is finished
  if (Number(capacity) == 0) {
    return "concluded";
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
