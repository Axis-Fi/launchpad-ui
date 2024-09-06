import { Address } from "@repo/types";
import coreSample from "../axis-core/.arbitrum-one.json";
import peripherySample from "../axis-periphery/.blast.json";

type AxisCoreAddresses = Record<keyof typeof coreSample, string>;
type AxisPeripheryAddresses = Record<keyof typeof peripherySample, string>;

export function extractAddresses(addresses: Partial<AxisCoreAddresses>) {
  return {
    addresses: {
      batchAuctionHouse: addresses["deployments.BatchAuctionHouse"] as Address,
      batchCatalogue: addresses["deployments.BatchCatalogue"] as Address,
      encryptedMarginalPrice: addresses[
        "deployments.auctionModules.EncryptedMarginalPrice"
      ] as Address,
      fixedPriceBatch: addresses[
        "deployments.auctionModules.FixedPriceBatch"
      ] as Address,
      batchLinearVesting: addresses[
        "deployments.derivativeModules.BatchLinearVesting"
      ] as Address,
    },
  };
}

export function extractCallbacks(addresses: Partial<AxisPeripheryAddresses>) {
  return {
    callbacks: {
      cappedMerkleAllowlist: addresses[
        "deployments.callbacks.BatchMerkleAllowlist"
      ] as Address,
      merkleAllowlist: addresses[
        "deployments.callbacks.BatchMerkleAllowlist"
      ] as Address,
      tokenAllowlist: addresses[
        "deployments.callbacks.BatchTokenAllowlist"
      ] as Address,
      allocatedMerkleAllowlist: addresses[
        "deployments.callbacks.BatchAllocatedMerkleAllowlist"
      ] as Address,
      uniV2Dtl: addresses[
        "deployments.callbacks.BatchUniswapV2DirectToLiquidity"
      ] as Address,
      uniV3Dtl: addresses[
        "deployments.callbacks.BatchUniswapV3DirectToLiquidity"
      ] as Address,
      baselineMachiLaunch: addresses[
        "deployments.callbacks.BaselineMachiLaunch"
      ] as Address,
    },
  };
}
