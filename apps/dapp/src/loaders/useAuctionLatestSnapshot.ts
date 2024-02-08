import { GetAuctionLatestSnapshotQuery, useGetAuctionLatestSnapshotQuery } from "@repo/subgraph-client";

export type AuctionLotSnapshot = GetAuctionLatestSnapshotQuery["auctionLotSnapshots"][0];
export type AuctionLotSnapshotResult = {
    result?: AuctionLotSnapshot;
    isLoading: boolean;
}

export function useAuctionLatestSnapshot(lotId?: string): AuctionLotSnapshotResult {
    const { data, isLoading } = useGetAuctionLatestSnapshotQuery({ lotId: lotId || "" });

    if (data === undefined || data.auctionLotSnapshots.length === 0) {
        return {
            result: undefined,
            isLoading: isLoading
        };
    }

    return {
        result: data.auctionLotSnapshots[0],
        isLoading: isLoading
    }
}
