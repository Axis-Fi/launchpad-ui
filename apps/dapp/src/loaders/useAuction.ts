import {
  GetAuctionLotQuery,
  useGetAuctionLotQuery,
} from "@repo/subgraph-client";
import { getChainId, getStatus } from "./subgraphHelper";

type RawAuctionResult = GetAuctionLotQuery["auctionLots"][0];

type RawAuctionWithEventsResult = {
  chainId: number;
  status: string;
} & RawAuctionResult;

export type AuctionResult = {
  result?: RawAuctionWithEventsResult;
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
