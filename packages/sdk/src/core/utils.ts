import { type Chain } from "viem";
import { type AxisDeployments } from "@repo/deployments";
import type { AxisContractAddresses } from "@repo/types";

const getContractAddresses = (
  chainId: number,
  deployments: AxisDeployments,
): AxisContractAddresses => {
  return deployments[chainId!]?.addresses;
};

const getChainById = (
  chains: Record<string, Chain>,
  chainId: number,
): Chain | undefined => {
  return chains
    ? Object.values(chains).find((chain) => chain.id === chainId)
    : undefined;
};

export { getContractAddresses, getChainById };
