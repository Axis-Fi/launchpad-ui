import {
  GetAuctionLatestSnapshotQuery,
  useGetAuctionLatestSnapshotQuery,
} from "@repo/subgraph-client";
import { useQueries } from "@tanstack/react-query";
import { getChainId } from "./subgraphHelper";
import { AuctionStatus } from "src/types";

export type AuctionLotSnapshot =
  GetAuctionLatestSnapshotQuery["auctionLotSnapshots"][0] & {
    chainId: number;
    status: AuctionStatus;
  };

export type AuctionLotSnapshotResult = {
  result?: AuctionLotSnapshot;
  isLoading: boolean;
};

type AuctionLotSnapshotRaw =
  GetAuctionLatestSnapshotQuery["auctionLotSnapshots"][0];

function _getStatus(record: AuctionLotSnapshotRaw): AuctionStatus {
  return "created";
}

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
      status: _getStatus(record),
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
        status: _getStatus(record),
      },
      isLoading: query.isLoading,
    };
  });
}
