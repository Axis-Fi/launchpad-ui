import * as v from "valibot";
import { initTRPC } from "@trpc/server";
import type {
  Abi,
  AbiParametersToPrimitiveTypes,
  Address,
  ExtractAbiFunction,
  ExtractAbiFunctionNames,
} from "abitype";
import { AuctionMetadataSchema } from "./core/create/schema";
import { CreateTRPCProxyClient } from "@trpc/client";

class SdkError<TInput> extends Error {
  issues?: v.BaseIssue<TInput>[] | undefined;

  constructor(
    message: string,
    issues: v.BaseIssue<TInput>[] | undefined = undefined,
  ) {
    super(message);
    this.name = "OriginSdkError";
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

type OriginConfig = {
  cloak: {
    url: string;
  };
  metadata: {
    url: string;
  };
  subgraph?: {
    [chainId: number]: {
      url: string;
    };
  };
};

/**
 * Type-safe tRPC client for the IPFS API.
 * The server isn't public so we need to define the same type here.
 */
const t = initTRPC.create();

const router = t.router({
  storeAuctionInfo: t.procedure
    .input(v.parser(AuctionMetadataSchema))
    .output(
      v.parser(
        v.object({
          hash: v.object({
            hashV0: v.string(),
          }),
        }),
      ),
    )
    .mutation(() => ({ hash: { hashV0: "" } })),
});

type MetadataRouter = typeof router;

type MetadataClient = CreateTRPCProxyClient<MetadataRouter>;

export type {
  OriginConfig,
  ContractConfig,
  ContractFunctionReturn,
  MetadataClient,
  MetadataRouter,
};

export { SdkError };
