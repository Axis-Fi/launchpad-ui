import { axisContracts } from "./";
import {
  Address,
  Auction,
  AuctionType,
  AxisContractNames,
  AxisModuleContractNames,
} from "@repo/types";

const auctionHouseMap = {
  [AuctionType.SEALED_BID]: "batchAuctionHouse",
  [AuctionType.FIXED_PRICE]: "atomicAuctionHouse",
};

const catalogueMap = {
  [AuctionType.SEALED_BID]: "batchCatalogue",
  [AuctionType.FIXED_PRICE]: "atomicCatalogue",
};

const moduleMap = {
  [AuctionType.SEALED_BID]: "encryptedMarginalPrice",
  [AuctionType.FIXED_PRICE]: "fixedPriceSale",
};

function getContractsByModuleType(auction: Auction) {
  const auctionModule = moduleMap[
    auction.auctionType
  ] as AxisModuleContractNames;

  const abi = axisContracts.abis[auctionModule];
  const address = axisContracts.addresses[auction.chainId][auctionModule];

  if (!abi || !address) {
    throw new Error(`Can't find abi/address for ${auction.auctionType}`);
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
  const contractName = auctionHouseMap[
    auction.auctionType
  ] as AxisContractNames;

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
    return undefined;
  }

  return {
    abi,
    address,
  };
}

export { getContractsByModuleType, getAuctionHouse, getCatalogue };
