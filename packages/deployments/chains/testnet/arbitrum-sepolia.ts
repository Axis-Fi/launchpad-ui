import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  addresses: {
    atomicAuctionHouse: "0xAA0000A0F9FF55d5F00aB9cc8d05eF78DE4f9E8f",
    batchAuctionHouse: "0xBA00003Cc5713c5339f4fD5cA0339D54A88BC87b",
    atomicCatalogue: "0xD223Ae37b01Fe549f3D5b1901e4B15053540540F",
    batchCatalogue: "0xd3dbab6EeD17f7e4ce64441E79A6e34ef40f2754",
    encryptedMarginalPrice: "0x87F2a19FBbf9e557a68bD35D85FAd20dEec40494",
    fixedPriceSale: "0x0A0BA689D2D72D3f376293c534AF299B3C6Dac85",
    atomicLinearVesting: "0xA7413717C633175Bc5B669E94625a4d3FE009870",
    batchLinearVesting: "0xC818f1f000f9C24D014BCe2c5334e14B1360d9CD",
  },
  callbacks: {
    merkleAllowlist: "0x98e59Cb79a866d3eF974F5e0B4D86d7Bbc0D7C7b",
    cappedMerkleAllowlist: "0x98d89517aab4b257C5Ef2Cf8387F8231287B179b",
    tokenAllowlist: "0x98B8491486e6B29E7d2B923DD3CD523E7940162B",
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
