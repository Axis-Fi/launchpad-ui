import type { Token } from "@repo/types";
import type { Chain } from "viem/chains";
import type { AxisDeployment, AxisDeploymentConfig } from "./types";
import subgraphConfig from "../subgraph-config";
import tokenlistMetadata from "../tokenlist-metadata";

/** Creates a deployment configuration */
export function createDeployment(config: AxisDeploymentConfig): AxisDeployment {
  return {
    addresses: config.addresses,
    subgraphURL: withVersion(config.subgraphURL, subgraphConfig.version),
    chain: withCustomRPC(config.chain, config.rpcURL),
    tokenList: withMetadata(config.tokenList, config.chain.id),
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
function withVersion(url: string, version: number | string) {
  return url.replace("<VERSION>", version.toString());
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

function withMetadata(tokens: Omit<Token, "chainId">[], chainId: number) {
  return {
    ...tokenlistMetadata,
    isActive: true,
    tokens: tokens.map((t) => ({ ...t, chainId })),
  };
}
