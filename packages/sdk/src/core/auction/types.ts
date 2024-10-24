import * as v from "valibot";
import { abis } from "@repo/abis";
import {
  GetAuctionParamsSchema,
  GetAuctionTokenDecimalsParamsSchema,
} from "./schema";
import { ContractFunctionReturn } from "../../types";
import * as auction from ".";

type GetAuctionParams = v.InferOutput<typeof GetAuctionParamsSchema>;
type GetAuctionResult = ContractFunctionReturn<
  typeof abis.batchCatalogue, // TODO multiple catalogue types
  "getRouting"
>;

type GetAuctionTokenDecimalsParams = v.InferOutput<
  typeof GetAuctionTokenDecimalsParamsSchema
>;

type GetAuctionTokenDecimalsResult = {
  baseTokenDecimals: number;
  quoteTokenDecimals: number;
};

type AuctionModule = {
  schema: typeof auction.schema;
  functions: typeof auction.functions;
  utils: typeof auction.utils;
};

export type {
  GetAuctionParams,
  GetAuctionTokenDecimalsParams,
  GetAuctionResult,
  GetAuctionTokenDecimalsResult,
  AuctionModule,
};
