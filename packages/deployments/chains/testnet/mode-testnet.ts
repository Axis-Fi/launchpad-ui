import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "mode-testnet",
  chain: modeTestnet,
  chainIconUrl: "/mode-logo.svg",
  addresses: {
    atomicAuctionHouse: "0xAa000000c0F79193A7f3a76C9a0b8b905e901fea",
    batchAuctionHouse: "0xBA0000004d9B5D528077C97dD0097b8DC836F173",
    atomicCatalogue: "0x2C7aE1A3989f17a6d9935382bDe7F1b021055083",
    batchCatalogue: "0x873966578C8ECcD61fc68F1Be3681146f86587e4",
    encryptedMarginalPrice: "0x16006e7C3015dC53CD102A9a5eCcfB9749779D91",
    fixedPriceSale: "0x8Db46375e73545226E99b5e8cBfe2794ac835D38",
    atomicLinearVesting: "0xA06A0A5D22E31D8d19c49FFd65c8FC37477077e2",
    batchLinearVesting: "0xD55227c0C37C97Fa2619a9C7F658C173883C1E2a",
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
