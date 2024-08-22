import { baseSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth, usdc } from "../../tokens/common";
import core from "../../axis-core/.base-sepolia.json";
import periphery from "../../axis-periphery/.base-sepolia.json";
import { extractAddresses, extractCallbacks } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "base-sepolia",
  chain: baseSepolia,
  chainIconUrl: "/base-logo.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-base-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://base-sepolia.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x4200000000000000000000000000000000000006", //WETH9
  tokenList: [
    {
      ...usdc,
      address: "0x4c9d75fbdf764d05df654340a48f85bc0216f8ab",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0x5384c9408f65978b4318a95b70af383ca06f1cf0",
      mintable: true,
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
