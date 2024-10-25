import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";

type CancelParams = v.InferOutput<typeof schema>;
type CancelConfig = ContractConfig<typeof abis.batchAuctionHouse, "cancel">;

export type { CancelParams, CancelConfig };
