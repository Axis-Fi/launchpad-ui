import type { AxisTransaction } from "./types";
import type { AbortParams } from "../../core";
import { getConfig, schema } from "../../core/abort";
import { useAxisTransaction } from "./use-axis-transaction";

export function useAbort(params: AbortParams): AxisTransaction<"abort"> {
  return useAxisTransaction(params, schema, "abort", getConfig);
}
