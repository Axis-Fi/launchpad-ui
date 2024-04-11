import type { Abi, ExtractAbiFunctionNames } from "abitype";
import { type ContractConfig, type SdkResponse, SdkError } from "./types";

const success = <
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
>(
  config: ContractConfig<TAbi, TFunctionName>,
): SdkResponse<TAbi, TFunctionName> => ({
  status: "success",
  config,
});

const fail = <
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
>(
  error: unknown,
): SdkResponse<TAbi, TFunctionName> => {
  return {
    status: "fail",
    error: error instanceof Error ? error.message : "Unknown error",
    issues: error instanceof SdkError ? error.issues : undefined,
  };
};

export { success, fail };
