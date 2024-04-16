import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import * as v from "valibot"; // TODO: zod vs valibot, zod more popular but large bundle size

class SdkError extends Error {
  issues?: v.SchemaIssues | undefined;

  constructor(message: string, issues: v.SchemaIssues | undefined = undefined) {
    super(message);
    this.name = "SdkError";
    this.issues = issues;
  }
}

type FunctionParams<
  TAbi extends Abi,
  TFunctionName extends string,
> = AbiParametersToPrimitiveTypes<
  ExtractAbiFunction<TAbi, TFunctionName>["inputs"],
  "inputs"
>;

type ContractConfig<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = {
  abi: Abi;
  address: Address;
  functionName: TFunctionName;
  args: FunctionParams<TAbi, TFunctionName>;
};

type SdkResult<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi>,
> = {
  status: "success" | "fail";
  error?: string; // TODO: Custom SDK error types?
  issues?: v.SchemaIssues;
  config?: ContractConfig<TAbi, TFunctionName>;
};

type OriginConfig = {
  cloak: {
    url: string;
  };
  // TODO: ipfs, subgraph, etc.
};

export type { OriginConfig, SdkResult, ContractConfig };

export { SdkError };
