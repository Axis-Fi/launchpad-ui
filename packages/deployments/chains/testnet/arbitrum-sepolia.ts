import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  addresses: {
    batchAuctionHouse: "0xBA00002999aBfa63cA25B3A7aD4c8F3a578aBe28",
    batchCatalogue: "0x664268B82971D0c9A4F000a7329a057e85361E83",
    encryptedMarginalPrice: "0x2Ca8954B468E2FbfE55240B69db937861c12F0d0",
    fixedPriceBatch: "0x8b47F82a58d8AFBE5167feBf0D3F3Bb509aaf2bd",
    batchLinearVesting: "0xFB1113E170CA6d95f3a91121BDD2370a822598E9",
  },
  callbacks: {
    cappedMerkleAllowlist: "0x9888DbABd5981763697A4433Cb57E3F9DABEcB6a",
    merkleAllowlist: "0x9837cA34C444cEbd07C699036D1D174C6392D9fa",
    tokenAllowlist: "0x988c61b36F7898e464a0Bf477d2dc06aC4E95F95",
    allocatedMerkleAllowlist: "0x98B59b4BF62b0316D9B0f89D28A28d5D75BB8B46",
    uniV2Dtl: "0xE676907Fa9a09dC1E3b67De11816665A1313524f",
    uniV3Dtl: "0xE6ECF0f655E642834c79F30323e7ae941883ac00",
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
  ],
};

export default config;
