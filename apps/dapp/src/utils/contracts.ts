import { axisContracts } from "@repo/deployments";
import {
  Auction,
  AuctionType,
  AxisContractNames,
  AxisModuleContractNames,
} from "@repo/types";

const moduleMap = {
  [AuctionType.SEALED_BID]: "atomicAuctionHouse",
  [AuctionType.FIXED_PRICE]: "batchAuctionHouse",
};

export function getContractsByModuleType(auction: Auction) {
  const auctionType = auction.auctionType as AxisModuleContractNames;

  const abi = axisContracts.abis[auctionType];
  const address = axisContracts.addresses[auction.chainId][auctionType];

  if (!abi || !address) {
    throw new Error(`Can't find abi/address for ${auctionType}`);
  }

  return { abi, address };
}

export function getAuctionHouse(
  auction: Pick<Auction, "chainId" | "auctionType">,
) {
  const contractName = moduleMap[auction.auctionType] as AxisContractNames;

  return {
    abi: axisContracts.abis[contractName],
    address: axisContracts.addresses[auction.chainId][contractName],
  };
}
