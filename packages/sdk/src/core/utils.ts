import { type Chain } from "viem";
import type { Abi, ExtractAbiFunctionNames } from "abitype";
import { deployments } from "@repo/deployments";
import { AxisContractAddresses } from "@repo/types";
import { type ContractConfig, type SdkResult } from "../types";

const success = <
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
>(
  config: ContractConfig<TAbi, TFunctionName>,
): SdkResult<TAbi, TFunctionName> => ({
  status: "success",
  config,
});

const getContractAddresses = (chainId: number): AxisContractAddresses =>
  deployments[chainId!]?.addresses;

const getChainById = (
  chains: Record<string, Chain>,
  chainId: number,
): Chain | undefined =>
  Object.values(chains).find((chain) => chain.id === chainId);

export { success, getContractAddresses, getChainById };
