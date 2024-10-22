import { mantle } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import core from "../../axis-core/.mantle.json";
import periphery from "../../axis-periphery/.mantle.json";
import { extractAddresses, extractCallbacks } from "../helpers";
import { usdc, usdt, weth } from "../../tokens/common";

const config: AxisDeploymentConfig = {
  name: "mantle",
  chain: mantle,
  chainIconUrl: "/mantle-logo.svg",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-mantle/<VERSION>/gn",
  rpcURL:
    "https://mantle-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
  tokenList: [
    {
      ...usdc,
      address: "0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9",
    },
    {
      ...usdt,
      address: "0x201EBa5CC46D216Ce6DC03F6a759e8E766e956aE",
    },
    {
      ...weth,
      address: "0xdeaddeaddeaddeaddeaddeaddeaddeaddead1111",
    },
    {
      symbol: "WMNT",
      name: "Mantle",
      address: "0x78c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8",
      decimals: 18,
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/mantle.svg",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
