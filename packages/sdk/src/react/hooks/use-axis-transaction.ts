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

export function useAxisTransaction<
  TParams,
  TParamsSchema extends v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>,
  TFunctionName extends AxisFunctionName,
  TConfig extends ContractConfig<BatchAuctionHouseAbi, TFunctionName>,
  TGetConfig extends (params: TParams, deps: TDeps) => Promise<TConfig>,
  TDeps = unknown,
>(
  _params: TParams extends { chainId: number } ? TParams : never,
  _paramsSchema: TParamsSchema,
  _functionName: TFunctionName,
  _getConfig: TGetConfig,
  _deps: TDeps,
): AxisTransaction<TFunctionName> {
  const parsedParams = v.safeParse(_paramsSchema, _params);

  const config = useQuery({
    queryKey: ["config", _functionName, _params],
    queryFn: () => _getConfig(_params, _deps),
    enabled: parsedParams.success,
  });

  const { abi, address, functionName, args } = config.data || {};

  const transaction = useWriteContract();

  const simulation = useSimulateContract({
    abi,
    address,
    chainId: _params.chainId,
    functionName,
    // @ts-expect-error TODO typing fails on build
    args,
    query: { enabled: config != null && parsedParams.success },
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
      // @ts-expect-error TODO typing fails on build
      transaction.writeContract(config.data);
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
