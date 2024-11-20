import * as v from "valibot";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  type UseSimulateContractReturnType,
} from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { type BatchAuctionHouseAbi } from "@repo/abis";
import type { AxisFunctionName, AxisTransaction } from "./types";
import { ContractConfig } from "../../types";

type TGetConfigWithoutDeps<TParams, TConfig> = (
  params: TParams,
) => TConfig | Promise<TConfig>;

type TGetConfigWithDeps<TParams, TConfig, TDeps> = (
  params: TParams,
  deps: TDeps,
) => TConfig | Promise<TConfig>;

export function useAxisTransaction<
  TParams,
  TParamsSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  TFunctionName extends AxisFunctionName,
  TConfig extends ContractConfig<BatchAuctionHouseAbi, TFunctionName>,
  TDeps = unknown | undefined,
>(
  params: TParams extends { chainId: number } ? TParams : never,
  paramsSchema: TParamsSchema,
  functionName: TFunctionName,
  getConfig: TDeps extends undefined
    ? TGetConfigWithoutDeps<TParams, TConfig>
    : TGetConfigWithDeps<TParams, TConfig, TDeps>,
  deps?: TDeps,
): AxisTransaction<TFunctionName> {
  const parsedParams = v.safeParse(paramsSchema, params);

  const config = useQuery({
    queryKey: ["config", functionName, params],
    queryFn: () =>
      deps
        ? getConfig(params, deps)
        : (getConfig as TGetConfigWithoutDeps<TParams, TConfig>)(params),
    enabled: parsedParams.success,
  });

  const transaction = useWriteContract();

  const simulation = useSimulateContract({
    abi: config.data!.abi,
    address: config.data!.address,
    chainId: params.chainId,
    functionName: config.data!.functionName,
    args: config.data!.args,
    query: {
      enabled: config != null && config.data != null && parsedParams.success,
    },
  }) satisfies UseSimulateContractReturnType<
    BatchAuctionHouseAbi,
    TFunctionName
  >;

  const receipt = useWaitForTransactionReceipt({
    hash: transaction.data,
    query: {
      enabled: config != null && parsedParams.success && simulation.isSuccess,
    },
  });

  const submit = () => {
    if (simulation.data && config.data != null) {
      transaction.writeContract(config.data!);
    }
  };

  const isWaiting =
    transaction.isPending || receipt.isLoading || config.isLoading;

  const error =
    simulation.error || transaction.error || receipt.error || config.error;

  return {
    submit,
    simulation,
    transaction,
    receipt,
    isWaiting,
    error,
  };
}
