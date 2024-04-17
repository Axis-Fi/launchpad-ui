import * as v from "valibot";
import { abis } from "@repo/abis";
import type { Token } from "@repo/types";
import { GetAuctionParamsSchema, GetAuctionTokensParamsSchema } from "./schema";
import { ContractFunctionReturn } from "../../types";

type GetAuctionParams = v.Input<typeof GetAuctionParamsSchema>;
type GetAuctionTokensParams = v.Input<typeof GetAuctionTokensParamsSchema>;

type GetAuctionResult = ContractFunctionReturn<
  typeof abis.catalogue,
  "getRouting"
>;
type GetAuctionTokensResult = { baseToken: Token; quoteToken: Token };

export type {
  GetAuctionParams,
  GetAuctionTokensParams,
  GetAuctionResult,
  GetAuctionTokensResult,
};
