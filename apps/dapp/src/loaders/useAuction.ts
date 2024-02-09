import { useGetAuctionLotQuery } from "@repo/subgraph-client";
import { AuctionWithEvents } from "src/types";
import { getChainId, getStatus } from "./subgraphHelper";

export type AuctionResult = {
  result?: AuctionWithEvents;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading } = useGetAuctionLotQuery({ lotId: lotId || "" });
  if (data === undefined || data.auctionLots.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading,
    };
  }

  const record = data.auctionLots[0];

  return {
    result: {
      ...record,
      chainId: getChainId(record.chain),
      status: getStatus(record.start, record.conclusion, record.capacity),
    },
    isLoading: isLoading,
  };
}
