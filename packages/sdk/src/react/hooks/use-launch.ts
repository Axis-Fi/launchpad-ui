import type { UseQueryResult } from "@tanstack/react-query";
import {
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client";
import { getLaunchId } from "../../core/utils";
import { deployments } from "@repo/deployments";
import { useSdk } from "../use-sdk";

type LaunchQuery = GetBatchAuctionLotQuery["batchAuctionLot"];

export const useLaunch = (chainId: number, lotId: number) => {
  const sdk = useSdk();
  const id = getLaunchId(chainId, lotId);
  const isQueryEnabled = chainId != null && id != null;

  const subgraphUrl =
    sdk.config?.subgraph?.[chainId]?.url ?? deployments[chainId!].subgraphURL;

  const { data, isLoading }: UseQueryResult<LaunchQuery> =
    useGetBatchAuctionLotQuery(
      {
        endpoint: subgraphUrl,
      },
      { id: id! },
      { enabled: isQueryEnabled },
    );

  return {
    data,
    isLoading,
  };
};
