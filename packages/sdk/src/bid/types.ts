import * as v from "valibot";
import type { Address } from "abitype";
import { abis } from "@repo/abis";
import type { Token } from "@repo/types";
import type { EncryptLotIdPost200Response } from "@repo/cloak";
import { BidParamsSchema } from "./schema";
import type { ContractConfig, SdkResponse } from "../types";

type GetBidConfigParams = Pick<
  BidParams,
  "lotId" | "amountIn" | "referrerAddress"
> & {
  auctionHouseAddress: Address;
  quoteToken: Token;
  encryptedBid: EncryptLotIdPost200Response;
};

type BidParams = v.Input<typeof BidParamsSchema>;
type BidConfig = ContractConfig<typeof abis.auctionHouse, "bid">;
type BidResponse = SdkResponse<typeof abis.auctionHouse, "bid">;

// TODO: Should we export contract return types from the ABI so that a consumer can typesafe the return value?
// type FunctionReturn<TAbi extends Abi, TFunctionName extends string> =
//   AbiParametersToPrimitiveTypes<ExtractAbiFunction<TAbi, TFunctionName>["outputs"], "outputs"> extends infer OutputArray
//     ? OutputArray extends readonly []
//       ? undefined
//       : OutputArray extends readonly [infer SingleOutput]
//         ? SingleOutput
//         : OutputArray
//     : void;

export type { GetBidConfigParams, BidParams, BidConfig, BidResponse };
