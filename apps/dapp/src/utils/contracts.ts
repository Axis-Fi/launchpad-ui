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
} as const;

export const moduleMap = {
  [AuctionType.SEALED_BID]: "encryptedMarginalPrice",
  [AuctionType.FIXED_PRICE_BATCH]: "fixedPriceBatch",
} as const;

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
  ] satisfies AxisContractNames;

  return {
    abi: axisContracts.abis[contractName],
    address: axisContracts.addresses[auction.chainId][contractName] as Address,
  };
}

// TODO add DTL contracts once they exist
export const callbackMap: Record<CallbacksType, string> = {
  [CallbacksType.NONE]: "",
  [CallbacksType.CUSTOM]: "",
  [CallbacksType.MERKLE_ALLOWLIST]: "merkleAllowlist",
  [CallbacksType.CAPPED_MERKLE_ALLOWLIST]: "cappedMerkleAllowlist",
  [CallbacksType.TOKEN_ALLOWLIST]: "tokenAllowlist",
  [CallbacksType.ALLOCATED_MERKLE_ALLOWLIST]: "allocatedMerkleAllowlist",
  [CallbacksType.UNIV2_DTL]: "uniV2Dtl",
  [CallbacksType.UNIV3_DTL]: "uniV3Dtl",
  [CallbacksType.CLEO_DTL]: "cleoDTL",
};

/** Labels for callback contract options */
export const callbackLabels: Record<CallbacksType, string> = {
  [CallbacksType.NONE]: "None",
  [CallbacksType.CUSTOM]: "Custom",
  [CallbacksType.MERKLE_ALLOWLIST]: "Offchain Allowlist",
  [CallbacksType.CAPPED_MERKLE_ALLOWLIST]: "Offchain Allowlist with Spend Cap",
  [CallbacksType.ALLOCATED_MERKLE_ALLOWLIST]:
    "Offchain Allowlist with Allocations",
  [CallbacksType.TOKEN_ALLOWLIST]: "Token Allowlist",
  [CallbacksType.UNIV2_DTL]: "Deposit to Uniswap V2 Pool",
  [CallbacksType.UNIV3_DTL]: "Deposit to Uniswap V3 Pool",
  [CallbacksType.CLEO_DTL]: "Deposit to Cleopatra Pool",
};

export function getCallbacks(chainId: number, callbackType: CallbacksType) {
  const contractName = callbackMap[callbackType] as AxisCallbackNames;

  return {
    //@ts-expect-error TODO: added CleoDTL abi
    abi: axisContracts.abis[contractName],
    address: axisContracts.addresses[chainId][contractName] as Address,
  };
}
