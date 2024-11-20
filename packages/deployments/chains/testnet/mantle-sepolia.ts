import { mantleTestnet } from "viem/chains";
import type { AxisDeploymentConfig } from "../../src/types";
import { weth, usdc } from "../../tokens/common";
import core from "../../axis-core/.mantle-sepolia.json";
import periphery from "../../axis-periphery/.mantle-sepolia.json";
import { extractCallbacks, extractAddresses } from "../helpers";

const config: AxisDeploymentConfig = {
  name: "mantle-sepolia-testnet",
  chain: mantleTestnet,
  chainIconUrl: "/mantle-logo.svg",
  subgraphURL:
    "https://api.goldsky.com/api/public/project_clu16lu24lqh201x9f0qh135t/subgraphs/axis-origin-mantle-sepolia/<VERSION>/gn",
  rpcURL: "https://rpc.sepolia.mantle.xyz",
  tokenList: [
    {
      ...usdc,
      address: "0x831b513392cd10d7720380f877383ee8ed543f0f",
      decimals: 18,
      mintable: true,
    },
    {
      ...weth,
      address: "0xc83696ec858e370fb9e109ce141c4c86cb705a73",
      mintable: true,
    },
    {
      symbol: "WMNT",
      name: "Wrapped Mantle",
      address: "0x4a7d9a72c29c6f1e74ce6a972c5cad1b1b00dff9",
      decimals: 18,
      logoURI:
        "https://storage.bondprotocol.finance/6e41a561-e275-4698-bc36-548d30a80e96-bucket/chains/mantle.svg",
      mintable: true,
    },
  ],
  ...extractAddresses(core),
  ...extractCallbacks(periphery),
};

export default config;
