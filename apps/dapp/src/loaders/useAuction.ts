import {
  GetAuctionsQuery,
  useGetAuctionEventsQuery,
} from "@repo/subgraph-client";
import { Auction, AuctionStatus } from "src/types";
import { getChainId } from "./subgraphHelper";

export type AuctionResult = {
  result?: Auction;
  isLoading: boolean;
};

type AuctionRaw = GetAuctionsQuery["auctionCreateds"][0];

function _getStatus(record: AuctionRaw): AuctionStatus {
  return "created";
}

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
      status: _getStatus(record),
    },
    isLoading: isLoading,
  };
}
