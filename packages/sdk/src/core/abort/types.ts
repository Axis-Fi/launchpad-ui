import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";

type AbortParams = v.Input<typeof schema>;
type AbortConfig = ContractConfig<typeof abis.batchAuctionHouse, "abort">;

export type { AbortParams, AbortConfig };
