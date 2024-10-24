import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";

type ClaimBidsParams = v.InferOutput<typeof schema>;
type ClaimBidsConfig = ContractConfig<
  typeof abis.batchAuctionHouse,
  "claimBids"
>;

export type { ClaimBidsParams, ClaimBidsConfig };
