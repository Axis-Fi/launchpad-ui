import { blast } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { weth } from "../../tokens/common";
import core from "../../axis-core/.blast.json";
import periphery from "../../axis-periphery/.blast.json";
import { extractAddresses, extractCallbacks } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "blast",
  chain: blast,
  chainIconUrl: "/blast-logo.png",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-blast/<VERSION>/gn",
  rpcURL:
    "https://blast-mainnet.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  wrapperContract: "0x4300000000000000000000000000000000000004",
  tokenList: [
    {
      address: "0x4300000000000000000000000000000000000003",
      decimals: 18,
      symbol: "USDB",
      name: "Blast USD",
      logoURI:
        "https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65c67eafd3569b7e2f834b8d_usdb-icon-yellow.svg",
    },
    {
      ...weth,
      address: "0x4300000000000000000000000000000000000004",
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
