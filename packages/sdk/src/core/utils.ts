import { type Chain } from "viem";
import { deployments } from "@repo/deployments";
import { AxisContractAddresses } from "@repo/types";
import { Config } from "./types";

const config = <TConfig>(config: TConfig): Config<TConfig> => ({ config });

const getContractAddresses = (chainId: number): AxisContractAddresses =>
  deployments[chainId!]?.addresses;

const getChainById = (
  chains: Record<string, Chain>,
  chainId: number,
): Chain | undefined =>
  Object.values(chains).find((chain) => chain.id === chainId);

export { config, getContractAddresses, getChainById };
