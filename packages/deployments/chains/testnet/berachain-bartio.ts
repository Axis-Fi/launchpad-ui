import { berachainTestnetbArtio } from "viem/chains";

import { AxisDeploymentConfig } from "../../src/types";
import core from "../../axis-core/.berachain-bartio.json";
import { extractAddresses } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "berachain-bartio",
  chain: berachainTestnetbArtio,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/berachain-logo.png",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-berachain-bartio/<VERSION>/gn",
  rpcURL:
    "https://berachain-bartio.g.alchemy.com/v2/h6OEviwRZGmTSXHYPRmMquo5u-YoWLeY",
  tokenList: [],
  ...extractAddresses(core),
};

export default config;
