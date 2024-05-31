import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

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
    fixedPriceBatch: "0xB24D0b6ae015DC6fd279E330db101bB890d8060c",
    atomicLinearVesting: "0xA7413717C633175Bc5B669E94625a4d3FE009870",
    batchLinearVesting: "0xC818f1f000f9C24D014BCe2c5334e14B1360d9CD",
  },
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-arbitrum-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://arb-sepolia.g.alchemy.com/v2/ijPbOvV9qNWHPGz-x-7JRvPwzUdBn1TJ",
  tokenList: [
    {
      name: "USDC",
      symbol: "USDC",
      address: "0x4f3cf5d09a3e47bf9d6a9d295e4a643c79c43429",
      decimals: 18,
      mintable: true,
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/USDC.png",
    },

    {
      address: "0x67dac8d7aeacc88c512f089a0abfff17e714535e",
      name: "Wrapped Ether",
      symbol: "WETH",
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/WETH.png",
      decimals: 18,
      mintable: true,
    },
  ],
};

export default config;
