import type { AxisTransaction } from "./types";
import type { SettleParams } from "../../core";
import { getConfig, schema } from "../../core/settle";
import { useAxisTransaction } from "./use-axis-transaction";

export function useSettle(params: SettleParams): AxisTransaction<"settle"> {
  return useAxisTransaction(params, schema, "settle", getConfig);
}
