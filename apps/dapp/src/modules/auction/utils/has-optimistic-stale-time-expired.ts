import type { MaybeFresh } from "@repo/types";

const STALE_DURATION_AFTER_OPTIMISTIC_UPDATE = 10_000; // 10k ms = 10 seconds

/**
 * Check if the optimistic stale time of the supplied data has expired.
 */
const hasOptimisticStaleTimeExpired = (
  data?: MaybeFresh,
  staleTime: number = STALE_DURATION_AFTER_OPTIMISTIC_UPDATE,
) => {
  // If the data is not cached, it is considered stale
  if (
    !data?._lastOptimisticUpdateTimestamp ||
    !Number.isInteger(data._lastOptimisticUpdateTimestamp)
  ) {
    return true;
  }

  const timeSinceLastOptimisticUpdate =
    Date.now() - data._lastOptimisticUpdateTimestamp;
  return timeSinceLastOptimisticUpdate >= staleTime;
};

export { hasOptimisticStaleTimeExpired };
