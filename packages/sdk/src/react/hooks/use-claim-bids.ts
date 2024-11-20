import type { AxisTransaction } from "./types";
import type { ClaimBidsParams } from "../../core";
import { getConfig, schema } from "../../core/claim-bids";
import { useAxisTransaction } from "./use-axis-transaction";

export function useClaimBids(
  params: ClaimBidsParams,
): AxisTransaction<"claimBids"> {
  return useAxisTransaction(params, schema, "claimBids", getConfig);
}
