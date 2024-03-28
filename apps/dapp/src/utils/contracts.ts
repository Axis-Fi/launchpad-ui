import { axisContracts } from "@repo/deployments";
import { Auction, AxisContractAddresses } from "@repo/types";

export function getContractsByType(auction: Auction) {
  const auctionType =
    auction.auctionType?.toLowerCase() as keyof AxisContractAddresses;

  const abi = axisContracts.abis[auctionType];
  const address = axisContracts.addresses[auction.chainId][auctionType];

  if (!abi || !address) {
    throw new Error(`Can't find abi/address for ${auctionType}`);
  }

  return { abi, address };
}

export function getContractByChain(chainId: number) {
  const abi = axisContracts.abis.auctionHouse;
  const address = axisContracts.addresses[chainId].auctionHouse;

  if (!address || !abi) {
    throw new Error(`Can't find abi/address for ${chainId}`);
  }

  return { abi, address };
}
