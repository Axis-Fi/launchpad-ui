import { axisContracts } from "@repo/deployments";
import {
  Auction,
  AuctionType,
  AxisContractNames,
  AxisModuleContractNames,
} from "@repo/types";
import { Address } from "viem";

const moduleMap = {
  [AuctionType.SEALED_BID]: "batchAuctionHouse",
  [AuctionType.FIXED_PRICE]: "atomicAuctionHouse",
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
  auction: Partial<Pick<Auction, "chainId" | "auctionType">>,
) {
  //TODO: find a better way to handle this, see useAuction for usecase
  if (!auction.auctionType || !auction.chainId) {
    return {
      abi: axisContracts.abis.atomicAuctionHouse,
      address: "0x" as Address,
    };
  }
  const contractName = moduleMap[auction.auctionType] as AxisContractNames;

  return {
    abi: axisContracts.abis[contractName],
    address: axisContracts.addresses[auction.chainId][contractName] as Address,
  };
}
