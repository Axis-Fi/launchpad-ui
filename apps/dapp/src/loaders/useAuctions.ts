import { GetAuctionsQuery, useGetAuctionsQuery } from "@repo/subgraph-client";

export type Auction = GetAuctionsQuery["auctionCreateds"][0];
export type AuctionsResult = {
    result: Auction[];
    isLoading: boolean;
}

export function useAuctions(): AuctionsResult {
    const { data, isLoading } = useGetAuctionsQuery();

    return {
        result: data?.auctionCreateds ?? [],
        isLoading: isLoading
    }
}
