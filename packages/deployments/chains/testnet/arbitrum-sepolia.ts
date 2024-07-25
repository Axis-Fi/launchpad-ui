import { arbitrumSepolia } from "viem/chains";
import type { Address } from "@repo/types";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, weth } from "../../tokens/common";
// TODO axis-core will become a versioned dev dependency to this package
import addresses from "../../axis-core/.arbitrum-sepolia-v0.5.json";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
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
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-arbitrum-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://arb-sepolia.g.alchemy.com/v2/ijPbOvV9qNWHPGz-x-7JRvPwzUdBn1TJ",
  tokenList: [
    {
      ...usdc,
      address: "0x4f3cf5d09a3e47bf9d6a9d295e4a643c79c43429",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0x67dac8d7aeacc88c512f089a0abfff17e714535e",
      decimals: 18,
      mintable: true,
    },
    {
      name: "TEST",
      symbol: "TST",
      address: "0x536f26fbbf0c6aedf9aaa04033d148efd1a24281",
      decimals: 18,
      mintable: true,
    },
  ],
};

export default config;
