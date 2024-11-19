import type { AxisTransaction } from "./types";
import type { BidParams } from "../../core";
import { getConfig } from "../../core/bid";
import { BidParamsSchema } from "../../core/bid/schema";
import { useAxisTransaction } from "./use-axis-transaction";
import { useSdk } from "./use-sdk";

export function useBid(params: BidParams): AxisTransaction<"bid"> {
  const { cloakClient } = useSdk();
  return useAxisTransaction(
    params,
    BidParamsSchema,
    "bid",
    getConfig,
    cloakClient,
  );
}
