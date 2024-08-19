import { blastSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth } from "../../tokens/common";
import addresses from "../../axis-core/.blast-sepolia-v0.5.json";
import type { Address } from "@repo/types";

const config: AxisDeploymentConfig = {
  name: "blast-sepolia",
  chain: blastSepolia,
  chainIconUrl: "/blast-logo.png",
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
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-blast-sepolia/<VERSION>/gn",
  rpcURL:
    "https://broken-magical-hill.blast-sepolia.quiknode.pro/3bdd9ff197592ef9652987ef7dcf549e759c713d/",
  wrapperContract: "0x4200000000000000000000000000000000000023",
  tokenList: [
    {
      mintable: true,
      decimals: 18,
      symbol: "USDB",
      name: "Blast USD",
      address: "0x47F12ccE28D1A2ac9184777fa8a993C6067Df728",
      logoURI:
        "https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65c67eafd3569b7e2f834b8d_usdb-icon-yellow.svg",
    },
    {
      ...weth,
      mintable: true,
      decimals: 18,
      address: "0x1095e2650accccc10daaac305b380f23158f1d94",
    },
    {
      decimals: 18,
      symbol: "SLO",
      name: "SLO Token",
      address: "0xB24D0b6ae015DC6fd279E330db101bB890d8060c",
    },
  ],
};

export default config;
