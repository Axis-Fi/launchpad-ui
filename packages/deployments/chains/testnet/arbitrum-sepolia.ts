import { arbitrumSepolia } from "viem/chains";
import { AxisDeploymentConfig } from "../../src/types";
import { usdc, weth } from "../../tokens/common";
// TODO axis-core will become a versioned dev dependency to this package
import core from "../../axis-core/.arbitrum-sepolia.json";
import periphery from "../../axis-periphery/.arbitrum-sepolia.json";
import { extractAddresses, extractCallbacks } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "arbitrum-sepolia",
  chain: arbitrumSepolia,
  chainIconUrl:
    "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/ARBITRUM.png",

  subgraphURL:
    "https://subgraph.satsuma-prod.com/44c4cc082f74/spaces-team/axis-origin-arbitrum-sepolia/version/v<VERSION>/api",
  rpcURL:
    "https://arb-sepolia.g.alchemy.com/v2/ijPbOvV9qNWHPGz-x-7JRvPwzUdBn1TJ",
  wrapperContract: "0x2836ae2eA2c013acD38028fD0C77B92cccFa2EE4", //WETH9
  tokenList: [
    {
      ...usdc,
      address: "0x4f3cf5d09a3e47bf9d6a9d295e4a643c79c43429",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0x67dac8d7aeacc88c512f089a0abfff17e714535e",
      decimals: 18,
      mintable: true,
    },
    {
      name: "TEST",
      symbol: "TST",
      address: "0x536f26fbbf0c6aedf9aaa04033d148efd1a24281",
      decimals: 18,
      mintable: true,
    },
  ],

  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
