import type { Hex } from "viem";
import * as v from "valibot";
import type { Address } from "@repo/types";
import { abis } from "@repo/abis";
import * as bid from ".";
import type { ContractConfig } from "../../types";

type BidParams = v.Input<typeof bid.schema.BidParamsSchema>;
type BidConfig = ContractConfig<typeof abis.batchAuctionHouse, "bid">;

type PrimedBidParams = Pick<
  BidParams,
  "lotId" | "amountIn" | "bidderAddress" | "referrerAddress"
> & {
  auctionHouseAddress: Address;
  quoteTokenDecimals: number;
  auctionData?: Hex;
};

type EncryptBidParams = Pick<
  BidParams,
  "lotId" | "amountIn" | "amountOut" | "chainId" | "bidderAddress"
> & {
  quoteTokenDecimals: number;
  baseTokenDecimals: number;
  auctionHouseAddress: Address;
};

type BidModule = {
  schema: typeof bid.schema;
  functions: typeof bid.functions;
  abi: typeof bid.abi;
  utils: typeof bid.utils;
};

export type {
  PrimedBidParams,
  BidParams,
  BidConfig,
  EncryptBidParams,
  BidModule,
};
