import type { Abi, ExtractAbiFunctionNames } from "abitype";
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

export { success };
