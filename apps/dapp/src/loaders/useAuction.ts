import { GetAuctionsQuery, useGetAuctionEventsQuery } from "@repo/subgraph-client";

export type Auction = GetAuctionsQuery["auctionCreateds"][0];
export type AuctionResult = {
    result?: Auction;
    isLoading: boolean;
}

export function useAuction(lotId?: string): AuctionResult {
    const { data, isLoading } = useGetAuctionEventsQuery({ lotId: lotId || "" });
    if (data === undefined || data.auctionCreateds.length === 0) {
        return {
            result: undefined,
            isLoading: isLoading
        };
    }

    return {
        result: data.auctionCreateds[0],
        isLoading: isLoading
    }
}
