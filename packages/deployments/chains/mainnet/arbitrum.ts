import { arbitrum } from "viem/chains";
import type { AxisDeploymentConfig } from "../../src/types";
import core from "../../axis-core/.arbitrum-one.json";
import periphery from "../../axis-periphery/.arbitrum-one.json";
import { extractAddresses, extractCallbacks } from "../helpers";
import { dai, usdc, usdt, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "arbitrum",
  chain: arbitrum,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",
  subgraphURL:
    "https://subgraph.satsuma-prod.com/9d551092282a/spaces-team/axis-origin-arbitrum-one/version/v<VERSION>/api",
  rpcURL:
    "https://arb-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x82af49447d8a07e3bd95bd0d56f35241523fbab1",
  tokenList: [
    {
      ...dai,
      address: "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1",
    },
    {
      ...usdc,
      address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    },
    {
      ...usdt,
      address: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
    },
    {
      ...weth,
      address: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
