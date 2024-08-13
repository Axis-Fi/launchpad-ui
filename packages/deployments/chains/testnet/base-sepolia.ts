import { baseSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth, usdc } from "../../tokens/common";
import type { Address } from "@repo/types";
import addresses from "../../axis-core/.base-sepolia-v0.5.json";

const config: AxisDeploymentConfig = {
  name: "base-sepolia",
  chain: baseSepolia,
  chainIconUrl: "/base-logo.png",
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
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-base-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://base-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x4200000000000000000000000000000000000006", //WETH9
  tokenList: [
    {
      ...usdc,
      address: "0x4c9d75fbdf764d05df654340a48f85bc0216f8ab",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0x5384c9408f65978b4318a95b70af383ca06f1cf0",
      mintable: true,
    },
  ],
};

export default config;
