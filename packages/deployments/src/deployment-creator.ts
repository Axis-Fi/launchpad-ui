import type { Token, Chain } from "@repo/types";
import type { AxisDeployment, AxisDeploymentConfig } from "./types";
import subgraphConfig from "../subgraph-config";
import tokenlistMetadata from "../tokenlist-metadata";

/** Creates a deployment configuration */
export function createDeployment(config: AxisDeploymentConfig): AxisDeployment {
  return {
    addresses: config.addresses,
    callbacks: config.callbacks,
    subgraphURL: withVersion(config.subgraphURL, subgraphConfig.version),
    chain: withCustomRPCandIcon(
      config.chain,
      config.rpcURL,
      config.chainIconUrl,
    ),
    tokenList: withMetadata(config.tokenList, config.chain.id),
    dexURL: config.dexURL,
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
function withCustomRPCandIcon(
  chain: Chain,
  url?: string,
  iconUrl?: string,
): Chain {
  if (!url) return chain;

  return {
    ...chain,
    iconUrl,
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
