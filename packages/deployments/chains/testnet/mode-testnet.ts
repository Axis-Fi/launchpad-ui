import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "mode-testnet",
  chain: modeTestnet,
  chainIconUrl: "/mode-logo.svg",
  addresses: {
    batchAuctionHouse: "0xBA00002999aBfa63cA25B3A7aD4c8F3a578aBe28",
    batchCatalogue: "0x40Efc944A9bDe7Aea4853b435D5517433D02FfF8",
    encryptedMarginalPrice: "0x1A6Ba70B8e5957bCd03C20f9CF42D9e6D3d9b514",
    fixedPriceBatch: "0x75DA61536510BA0bCa0C9Af21311A1Fc035DCf4e",
    batchLinearVesting: "0x90608F57161aC771b28fb0adCd2434cfa1463201",
  },
  callbacks: {
    cappedMerkleAllowlist: "0x9888DbABd5981763697A4433Cb57E3F9DABEcB6a",
    merkleAllowlist: "0x9837cA34C444cEbd07C699036D1D174C6392D9fa",
    tokenAllowlist: "0x988c61b36F7898e464a0Bf477d2dc06aC4E95F95",
    allocatedMerkleAllowlist: "0x98B59b4BF62b0316D9B0f89D28A28d5D75BB8B46",
    uniV2Dtl: "0xE60FD6203AF5D5d43433952a033Cb70Ba21784E9",
    uniV3Dtl: "0xE6ce65C413a5Fc10Fa77B26032B33DCD68F8474a",
  },
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-mode-testnet/<VERSION>/gn",
  rpcURL: "https://sepolia.mode.network",
  tokenList: [
    {
      ...usdc,
      address: "0xfc3156a0a9295dcd83b8f405bae7a4b73f4e2306",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0xfdf5fe07a9c888f383aea34f152dee04baee7a2e",
      decimals: 18,
      mintable: true,
    },
  ],
};

export default config;
