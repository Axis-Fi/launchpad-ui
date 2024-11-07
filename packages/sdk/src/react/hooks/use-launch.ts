import type { UseQueryOptions } from "@tanstack/react-query";
import {
  BatchAuctionLot,
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client";
import { deployments } from "@repo/deployments";
import { getLaunchId } from "../../core/utils";
import { useSdk } from "./use-sdk";

type LaunchQueryConfig = {
  chainId: number;
  lotId: number;
  options?: Partial<
    UseQueryOptions<GetBatchAuctionLotQuery, unknown, BatchAuctionLot>
  >;
};
export const useLaunch = ({ chainId, lotId, options }: LaunchQueryConfig) => {
  const sdk = useSdk();
  const id = getLaunchId(chainId, lotId);
  const isQueryEnabled = chainId != null && id != null && options?.enabled;

  const subgraphUrl =
    sdk.config?.subgraph?.[chainId]?.url ?? deployments[chainId!].subgraphURL;

  return useGetBatchAuctionLotQuery(
    { endpoint: subgraphUrl },
    { id: id! },
    {
      enabled: isQueryEnabled,
      select: (data) => data.batchAuctionLot,
    },
  );
};
