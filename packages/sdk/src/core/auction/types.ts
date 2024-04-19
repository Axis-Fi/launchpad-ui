import * as v from "valibot";
import { abis } from "@repo/abis";
import { GetAuctionParamsSchema, GetAuctionTokensParamsSchema } from "./schema";
import { ContractFunctionReturn } from "../../types";

type GetAuctionParams = v.Input<typeof GetAuctionParamsSchema>;
type GetAuctionTokensParams = v.Input<typeof GetAuctionTokensParamsSchema>;

type GetAuctionTokensResult = {
  baseTokenDecimals: number;
  quoteTokenDecimals: number;
};
type GetAuctionResult = ContractFunctionReturn<
  typeof abis.catalogue,
  "getRouting"
>;

export type {
  GetAuctionParams,
  GetAuctionTokensParams,
  GetAuctionResult,
  GetAuctionTokensResult,
};
