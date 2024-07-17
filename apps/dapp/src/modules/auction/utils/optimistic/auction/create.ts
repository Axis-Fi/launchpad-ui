import type { GetBatchAuctionLotQuery } from "@repo/subgraph-client";
import type { NonNullSubgraphAuction } from "@repo/types";

const create = (
  optimisticAuction: NonNullSubgraphAuction,
): GetBatchAuctionLotQuery => ({
  batchAuctionLot: optimisticAuction,
});

export { create };
