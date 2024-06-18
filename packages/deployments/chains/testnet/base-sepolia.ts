import { baseSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth, usdc } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "base-sepolia",
  chain: baseSepolia,
  chainIconUrl: "/base-logo.png",
  addresses: {
    batchAuctionHouse: "0xBA00002999aBfa63cA25B3A7aD4c8F3a578aBe28",
    batchCatalogue: "0x408fB738592232372069B592022F03BF3a241613",
    encryptedMarginalPrice: "0x02c63F8aE0a8e9D0F7267AA4d0Af0567858188C2",
    fixedPriceBatch: "0x188Ad428c60eADFB0749B2E3A4836D63489304E3",
    batchLinearVesting: "0x392C629741a0c7350c7181addD5870dE178eeD94",
  },
  callbacks: {
    cappedMerkleAllowlist: "0x9888DbABd5981763697A4433Cb57E3F9DABEcB6a",
    merkleAllowlist: "0x9837cA34C444cEbd07C699036D1D174C6392D9fa",
    tokenAllowlist: "0x988c61b36F7898e464a0Bf477d2dc06aC4E95F95",
    allocatedMerkleAllowlist: "0x98B59b4BF62b0316D9B0f89D28A28d5D75BB8B46",
    uniV2Dtl: "0xE650A43485b89F26FB98ad16811BF45BD52ad014",
    uniV3Dtl: "0xE661c46d94c53584095A8240958695bAD6d6fC2F",
  },
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-base-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://base-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  tokenList: [
    {
      ...usdc,
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    },
    {
      ...weth,
      address: "0x4200000000000000000000000000000000000006",
    },
  ],
};

export default config;
