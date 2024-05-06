import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  addresses: {
    atomicAuctionHouse: "0xAA0000003E38C00379513d73FFbcEAFafcF1bB4C",
    batchAuctionHouse: "0xBA000000878cD72315d797b6de67b151Ae547038",
    atomicCatalogue: "0xF5c31d08a71c854A9f607A5992456dBC31B11e16",
    batchCatalogue: "0xacD10C2B4aA625dd00cba40E4466c8Ff07288a16",
    encryptedMarginalPrice: "0x2B63Aa737a1AD617A6d6894698Abd043F95cCecb",
    fixedPriceSale: "0x02c63F8aE0a8e9D0F7267AA4d0Af0567858188C2",
    atomicLinearVesting: "0x188Ad428c60eADFB0749B2E3A4836D63489304E3",
    batchLinearVesting: "0x392C629741a0c7350c7181addD5870dE178eeD94",
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
