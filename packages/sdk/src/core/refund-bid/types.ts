import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";

type RefundBidParams = v.InferOutput<typeof schema>;
type RefundBidConfig = ContractConfig<
  typeof abis.batchAuctionHouse,
  "refundBid"
>;

export type { RefundBidParams, RefundBidConfig };
