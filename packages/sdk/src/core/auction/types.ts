import * as v from "valibot";
import { abis } from "@repo/abis";
import type { Token } from "@repo/types";
import { GetAuctionParamsSchema, GetAuctionTokensParamsSchema } from "./schema";
import { ContractFunctionReturn } from "../../types";

type GetAuctionParams = v.Input<typeof GetAuctionParamsSchema>;
type GetAuctionTokensParams = v.Input<typeof GetAuctionTokensParamsSchema>;

type GetAuctionTokensResult = { baseToken: Token; quoteToken: Token };
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
