import {
  GetAuctionLatestSnapshotQuery,
  useGetAuctionLatestSnapshotQuery,
} from "@repo/subgraph-client";
import { useQueries } from "@tanstack/react-query";
import { getChainId, getStatus } from "./subgraphHelper";
import { AuctionStatus } from "src/types";

type AuctionLotSnapshotRaw =
  GetAuctionLatestSnapshotQuery["auctionLotSnapshots"][0];

export type AuctionLotSnapshot = AuctionLotSnapshotRaw & {
  chainId: number;
  status: AuctionStatus;
};

export type AuctionLotSnapshotResult = {
  result?: AuctionLotSnapshot;
  isLoading: boolean;
};

export function useAuctionLatestSnapshot(
  lotId?: string,
): AuctionLotSnapshotResult {
  const { data, isLoading } = useGetAuctionLatestSnapshotQuery({
    lotId: lotId || "",
  });

  if (data === undefined || data.auctionLotSnapshots.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading,
    };
  }

  const record = data.auctionLotSnapshots[0];

  return {
    result: {
      ...record,
      chainId: getChainId(record.lot.chain),
      status: getStatus(
        record.lot.start,
        record.lot.conclusion,
        record.capacity,
      ),
    },
    isLoading: isLoading,
  };
}

export function useAuctionsLatestSnapshot(
  lotIds: string[],
): AuctionLotSnapshotResult[] {
  const userQueries = useQueries({
    queries: lotIds.map((lotId) => {
      return {
        queryKey: ["auctionLatestSnapshot", lotId],
        queryFn: () => useGetAuctionLatestSnapshotQuery({ lotId: lotId }),
      };
    }),
  });

  return userQueries.map((query) => {
    if (
      query.data === undefined ||
      query.data.data === undefined ||
      query.data.data.auctionLotSnapshots.length === 0
    ) {
      return {
        result: undefined,
        isLoading: query.isLoading,
      };
    }

    const record = query.data.data.auctionLotSnapshots[0];

    return {
      result: {
        ...record,
        chainId: getChainId(record.lot.chain),
        status: getStatus(
          record.lot.start,
          record.lot.conclusion,
          record.capacity,
        ),
      },
      isLoading: query.isLoading,
    };
  });
}
