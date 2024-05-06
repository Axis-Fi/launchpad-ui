import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "mode-testnet",
  chain: modeTestnet,
  chainIconUrl: "/mode-logo.svg",
  addresses: {
    atomicAuctionHouse: "0xAA0000003E38C00379513d73FFbcEAFafcF1bB4C",
    batchAuctionHouse: "0xBA000000878cD72315d797b6de67b151Ae547038",
    atomicCatalogue: "0xc20918b09dE9708d2A7997dfFc3c5ACB34d4a15b",
    batchCatalogue: "0xCaAE490470305a9d6f58b026cdD36cc747F8F0b9",
    encryptedMarginalPrice: "0x0e4996960731Fec8E7C9DBbD51383fC71174DD88",
    fixedPriceSale: "0x4a7D9A72C29C6f1e74Ce6a972c5CAD1b1B00dff9",
    atomicLinearVesting: "0xE03E5bF70E04dB487bCa3A36beEFccd7b6be582F",
    batchLinearVesting: "0x3A327c856AF41EcF4d783975CE38f669dEeaB298",
  },
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-mode-testnet/<VERSION>/gn",
  rpcURL: "https://sepolia.mode.network",
  tokenList: [
    {
      name: "USDC",
      symbol: "USDC",
      address: "0xfc3156a0a9295dcd83b8f405bae7a4b73f4e2306",
      decimals: 18,
      mintable: true,
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/USDC.png",
    },

    {
      address: "0xfdf5fe07a9c888f383aea34f152dee04baee7a2e",
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
