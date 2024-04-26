import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  addresses: {
    atomicAuctionHouse: "0xAa000000c0F79193A7f3a76C9a0b8b905e901fea",
    batchAuctionHouse: "0xBA0000004d9B5D528077C97dD0097b8DC836F173",
    atomicCatalogue: "0x0e4996960731Fec8E7C9DBbD51383fC71174DD88",
    batchCatalogue: "0x68a8d91d9936b5Ef8b65f516F8a5AAB6c7b1E43e",
    encryptedMarginalPrice: "0x4a7D9A72C29C6f1e74Ce6a972c5CAD1b1B00df9",
    fixedPriceSale: "0xE03E5bF70E04dB487bCa3A36beEFccd7b6be582F",
    atomicLinearVesting: "0x3A327c856AF41EcF4d783975CE38f669dEeaB298",
    batchLinearVesting: "0x3c068BF506925A8349CC14438ce91d2C43793D4e",
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
