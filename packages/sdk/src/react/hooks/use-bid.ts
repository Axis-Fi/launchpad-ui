import type { AxisTransaction } from "./types";
import type { BidParams } from "../../core";
import { getConfig, schema } from "../../core/bid";
import { useAxisTransaction } from "./use-axis-transaction";
import { useSdk } from "./use-sdk";

export function useBid(params: BidParams): AxisTransaction<"bid"> {
  const { cloakClient } = useSdk();
  return useAxisTransaction(params, schema, "bid", getConfig, cloakClient);
}
