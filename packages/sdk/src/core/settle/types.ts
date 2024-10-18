import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";

type SettleParams = v.Input<typeof schema>;
type SettleConfig = ContractConfig<typeof abis.batchAuctionHouse, "settle">;

export type { SettleParams, SettleConfig };
