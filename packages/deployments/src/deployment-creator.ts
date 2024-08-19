import type { Token, Chain } from "@repo/types";
import type { AxisDeployment, AxisDeploymentConfig } from "./types";
import subgraphConfig from "../subgraph-config";
import tokenlistMetadata from "../tokenlist-metadata";

/** Creates a deployment configuration */
export function createDeployment(config: AxisDeploymentConfig): AxisDeployment {
  return {
    name: config.name,
    addresses: config.addresses,
    callbacks: config.callbacks,
    subgraphURL: withVersion(config.subgraphURL, subgraphConfig.version),
    chain: withCustomConfiguration(config),
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

/** Adds an Axis RPC URL, chain logo and wrapper contract to an existing viem Chain*/
function withCustomConfiguration({
  chain,
  ...config
}: AxisDeploymentConfig): Chain {
  if (!config.rpcURL) return chain;

  return {
    ...chain,
    iconUrl: config.chainIconUrl,
    rpcUrls: {
      ...chain.rpcUrls,
      axis: { http: [config.rpcURL] },
    },
    nativeCurrency: {
      ...chain.nativeCurrency,
      wrapperContract: config.wrapperContract,
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
