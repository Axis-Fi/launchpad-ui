import { axisContracts } from "@repo/deployments";
import {
  Auction,
  AuctionType,
  AxisContractNames,
  AxisCallbackNames,
  AxisModuleContractNames,
  CallbacksType,
} from "@repo/types";
import { Address } from "viem";

const auctionHouseMap = {
  [AuctionType.SEALED_BID]: "batchAuctionHouse",
  [AuctionType.FIXED_PRICE_BATCH]: "batchAuctionHouse",
};

export const moduleMap = {
  [AuctionType.SEALED_BID]: "encryptedMarginalPrice",
  [AuctionType.FIXED_PRICE_BATCH]: "fixedPriceBatch",
};

export function getContractsByModuleType(auction: Auction) {
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

export function getAuctionHouse(
  auction: Pick<Auction, "chainId" | "auctionType">,
) {
  //TODO: find a better way to handle this, see useAuction for usecase
  if (!auction.auctionType || !auction.chainId) {
    return {
      abi: axisContracts.abis.batchAuctionHouse,
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

// TODO add DTL contracts once they exist
const callbackMap = {
  [CallbacksType.NONE]: "",
  [CallbacksType.CUSTOM]: "",
  [CallbacksType.MERKLE_ALLOWLIST]: "merkleAllowlist",
  [CallbacksType.CAPPED_MERKLE_ALLOWLIST]: "cappedMerkleAllowlist",
  [CallbacksType.TOKEN_ALLOWLIST]: "tokenAllowlist",
  [CallbacksType.ALLOCATED_MERKLE_ALLOWLIST]: "allocatedMerkleAllowlist",
};

export function getCallbacks(chainId: number, callbackType: CallbacksType) {
  const contractName = callbackMap[callbackType] as AxisCallbackNames;

  return {
    abi: axisContracts.abis[contractName],
    address: axisContracts.addresses[chainId][contractName] as Address,
  };
}
