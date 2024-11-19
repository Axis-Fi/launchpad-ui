import * as v from "valibot";
import { abis } from "@repo/abis";
import * as bid from ".";
import type { ContractConfig } from "../../types";

type BidParams = v.InferOutput<typeof bid.schema.BidParamsSchema>;
type BidConfig = ContractConfig<typeof abis.batchAuctionHouse, "bid">;

type EncryptBidParams = Pick<
  BidParams,
  | "lotId"
  | "amountIn"
  | "amountOut"
  | "chainId"
  | "bidderAddress"
  | "auctionType"
>;

export type { BidParams, BidConfig, EncryptBidParams };
