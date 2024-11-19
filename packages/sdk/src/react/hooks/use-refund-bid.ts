import type { AxisTransaction } from "./types";
import type { RefundBidParams } from "../../core";
import { getConfig, schema } from "../../core/refund-bid";
import { useAxisTransaction } from "./use-axis-transaction";

export function useRefundBid(
  params: RefundBidParams,
): AxisTransaction<"refundBid"> {
  return useAxisTransaction(params, schema, "refundBid", getConfig);
}
