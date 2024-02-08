import {
  GetAuctionsQuery,
  useGetAuctionEventsQuery,
} from "@repo/subgraph-client";
import { Auction } from "src/types";
import { getChainId, getStatus } from "./subgraphHelper";

type AuctionRaw = GetAuctionsQuery["auctionCreateds"][0];

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
};

export function useAuction(lotId?: string): AuctionResult {
  const { data, isLoading } = useGetAuctionEventsQuery({ lotId: lotId || "" });
  if (data === undefined || data.auctionCreateds.length === 0) {
    return {
      result: undefined,
      isLoading: isLoading,
    };
  }

  const record = data.auctionCreateds[0];

  return {
    result: {
      ...record,
      chainId: getChainId(record.chain),
      status: getStatus(record.start, record.conclusion, record.capacity),
    },
    isLoading: isLoading,
  };
}
