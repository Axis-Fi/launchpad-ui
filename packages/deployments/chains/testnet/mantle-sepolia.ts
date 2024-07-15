import { mantleSepoliaTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth, usdc } from "../../tokens/common";
import type { Address } from "@repo/types";
import addresses from "../../axis-core/.mantle-sepolia-v0.5.json";

const config: AxisDeploymentConfig = {
  name: "mantle-sepolia-testnet",
  chain: mantleSepoliaTestnet,
  chainIconUrl: "/mantle-logo.svg",
  addresses: {
    batchAuctionHouse: addresses["axis.BatchAuctionHouse"] as Address,
    batchCatalogue: addresses["axis.BatchCatalogue"] as Address,
    encryptedMarginalPrice: addresses["axis.EncryptedMarginalPrice"] as Address,
    fixedPriceBatch: addresses["axis.FixedPriceBatch"] as Address,
    batchLinearVesting: addresses["axis.BatchLinearVesting"] as Address,
  },
  callbacks: {
    cappedMerkleAllowlist: addresses[
      "axis.BatchCappedMerkleAllowlist"
    ] as Address,
    merkleAllowlist: addresses["axis.BatchMerkleAllowlist"] as Address,
    tokenAllowlist: addresses["axis.BatchTokenAllowlist"] as Address,
    allocatedMerkleAllowlist: addresses[
      "axis.BatchAllocatedMerkleAllowlist"
    ] as Address,
    uniV2Dtl: addresses["axis.BatchUniswapV2DirectToLiquidity"] as Address,
    uniV3Dtl: addresses["axis.BatchUniswapV3DirectToLiquidity"] as Address,
  },
  subgraphURL:
    "https://subgraph-api.mantle.xyz/api/public/d124a5f1-0609-435a-9a3a-dd525001afbe/subgraphs/axis-origin-mantle-sepolia/v<VERSION>/gn",
  rpcURL: "https://rpc.sepolia.mantle.xyz",
  tokenList: [
    {
      ...usdc,
      address: "0x831b513392cd10d7720380f877383ee8ed543f0f",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0xc83696ec858e370fb9e109ce141c4c86cb705a73",
      mintable: true,
    },
  ],
};

export default config;
