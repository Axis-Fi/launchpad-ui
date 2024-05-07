import { axisContracts } from "./";
import {
  Address,
  Auction,
  AuctionType,
  AxisContractNames,
  AxisModuleContractNames,
} from "@repo/types";

const moduleMap = {
  [AuctionType.SEALED_BID]: "batchAuctionHouse",
  [AuctionType.FIXED_PRICE]: "atomicAuctionHouse",
};

const catalogueMap = {
  [AuctionType.SEALED_BID]: "batchCatalogue",
  [AuctionType.FIXED_PRICE]: "atomicCatalogue",
};

function getContractsByModuleType(auction: Auction) {
  const auctionType = auction.auctionType as AxisModuleContractNames;

  const abi = axisContracts.abis[auctionType];
  const address = axisContracts.addresses[auction.chainId][auctionType];

  if (!abi || !address) {
    throw new Error(`Can't find abi/address for ${auctionType}`);
  }

  return { abi, address };
}

function getAuctionHouse(auction: Pick<Auction, "chainId" | "auctionType">) {
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

function getCatalogue(auction: Pick<Auction, "chainId" | "auctionType">) {
  const catalogueName = catalogueMap[auction.auctionType] as AxisContractNames;
  const abi = axisContracts.abis[catalogueName];
  const address = axisContracts.addresses[auction.chainId][
    catalogueName
  ] as Address;

  if (!abi || !address) {
    throw new Error(
      `Can't find abi/address for auctionType ${auction.auctionType} and chainId ${auction.chainId}`,
    );
  }

  return {
    abi,
    address,
  };
}

export { getContractsByModuleType, getAuctionHouse, getCatalogue };
