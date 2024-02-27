import { AxisContractAddresses } from "@repo/contracts";
import { AxisDeployment, Token } from "./types";
import { type Chain } from "viem/chains";
import subgraphConfig from "../subgraph-config";

/** Creates a deployment configuration */
export function createDeployment(config: {
  chain: Chain;
  addresses: AxisContractAddresses;
  tokenList: Omit<Token, "chainId">[];
  rpcURL?: string;
}): AxisDeployment {
  return {
    chain: withCustomRPC(config.chain, config.rpcURL),
    subgraphURL: makeSubgraphURL(config.chain.id),
    addresses: config.addresses,
    tokenList: config.tokenList.map((t) => ({
      ...t,
      chainId: config.chain.id,
    })),
  };
}

/** Creates a deployment record of deployments per chainId*/
export function createDeploymentRecord(
  chains: AxisDeployment[],
): Record<number, AxisDeployment> {
  return chains.reduce((acc, deployment) => {
    return {
      ...acc,
      [deployment.chain.id]: deployment,
    };
  }, {});
}

/** Generates a subgraph URL for a specific chain*/
function makeSubgraphURL(chainId: number) {
  return (
    subgraphConfig.baseURL +
    chainId +
    subgraphConfig.graph +
    subgraphConfig.version
  );
}

/** Adds an Axis RPC URL to an existing viem Chain*/
function withCustomRPC(chain: Chain, url?: string): Chain {
  if (!url) return chain;

  return {
    ...chain,
    rpcUrls: {
      ...chain.rpcUrls,
      axis: { http: [url] },
    },
  };
}
