import { mode } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, usdt, weth } from "../../tokens/common";
import { extractAddresses } from "../helpers";
import addresses from "../../axis-core/.mode-v1.0.0.json";

const config: AxisDeploymentConfig = {
  name: "mode",
  chain: mode,
  chainIconUrl: "/mode-logo.svg",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-mode-mainnet/<VERSION>/gn",
  rpcURL: "https://mainnet.mode.network",
  wrapperContract: "0x4200000000000000000000000000000000000006",
  tokenList: [
    {
      ...usdc,
      address: "0xd988097fb8612cc24eeC14542bC03424c656005f",
    },
    {
      ...usdt,
      address: "0xf0F161fDA2712DB8b566946122a5af183995e2eD",
    },
    {
      ...weth,
      address: "0x4200000000000000000000000000000000000006",
    },
  ],
  ...extractAddresses(addresses),
};

export default config;
