import * as v from "valibot";
import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";

class SdkError extends Error {
  issues?: v.SchemaIssues | undefined;

  constructor(message: string, issues: v.SchemaIssues | undefined = undefined) {
    super(message);
    this.name = "SdkError";
    this.issues = issues;
  }
}

type ContractFunctionParams<
  TAbi extends Abi,
  TFunctionName extends string,
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
  "inputs"
>;

type ContractFunctionReturn<
  TAbi extends Abi,
  TFunctionName extends string,
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, TFunctionName>["outputs"],
  "outputs"
> extends infer OutputArray
  ? OutputArray extends readonly [] // If the function has no return value, return undefined
    ? undefined
    : OutputArray extends readonly [infer SingleOutput] // If the function has a single return value, unwrap it
      ? SingleOutput
      : OutputArray // Otherwise, return the array of return values
  : void;

type ContractConfig<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = {
  abi: Abi;
  address: Address;
  functionName: TFunctionName;
  args: ContractFunctionParams<TAbi, TFunctionName>;
};

type SdkResult<TResult> = {
  config: TResult;
};

type OriginConfig = {
  cloak: {
    url: string;
  };
  // TODO: ipfs, subgraph, etc.
};

export type { OriginConfig, SdkResult, ContractConfig, ContractFunctionReturn };

export { SdkError };
