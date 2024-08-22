import { modeTestnet } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, weth } from "../../tokens/common";
import core from "../../axis-core/.mode-sepolia.json";
import periphery from "../../axis-periphery/.mode-sepolia.json";
import { extractCallbacks, extractAddresses } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "mode-testnet",
  chain: modeTestnet,
  chainIconUrl: "/mode-logo.svg",
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
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
