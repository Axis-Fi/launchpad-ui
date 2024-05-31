import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";

const config: AxisDeploymentConfig = {
  name: "mode-testnet",
  chain: modeTestnet,
  chainIconUrl: "/mode-logo.svg",
  addresses: {
    atomicAuctionHouse: "0xAA0000A0F9FF55d5F00aB9cc8d05eF78DE4f9E8f",
    batchAuctionHouse: "0xBA00003Cc5713c5339f4fD5cA0339D54A88BC87b",
    atomicCatalogue: "0x04974BcFC715c148818724d9Caab3Fe8d0391b8b",
    batchCatalogue: "0x32273229B482F39f5F8fBfA71569eA743740217c",
    encryptedMarginalPrice: "0x4e519eEf63b9e127cFCeCA31C8E5485CdA65D355",
    fixedPriceSale: "0xacD10C2B4aA625dd00cba40E4466c8Ff07288a16",
    fixedPriceBatch: "0xC818f1f000f9C24D014BCe2c5334e14B1360d9CD",
    atomicLinearVesting: "0x408fB738592232372069B592022F03BF3a241613",
    batchLinearVesting: "0x6CC5b76C2c98cB347F07C07a74a88134265312FF",
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
