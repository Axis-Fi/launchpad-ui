import { base } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import addresses from "../../axis-core/.base-v1.0.0.json";
import { extractCallbacks, extractAddresses } from "../helpers";
import { usdc, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "base",
  chain: base,
  chainIconUrl: "/base-logo.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/9d551092282a/spaces-team/axis-origin-base/version/v<VERSION>/api",
  rpcURL:
    "https://base-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  tokenList: [
    {
      ...usdc,
      address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    {
      ...weth,
      address: "0x4200000000000000000000000000000000000006",
    },
  ],
  ...extractAddresses(addresses),
  ...extractCallbacks(addresses),
};

export default config;
