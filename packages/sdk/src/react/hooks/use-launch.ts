import {
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client";
import { deployments } from "@repo/deployments";
import { getLaunchId } from "../../core/utils";
import { useSdk } from "./use-sdk";

type UseGetBatchAuctionLotQueryOptions = Parameters<
  typeof useGetBatchAuctionLotQuery
>[2];

type LaunchQueryConfig = {
  chainId: number;
  lotId: number;
  options?: Partial<UseGetBatchAuctionLotQueryOptions>;
};

export const useLaunch = ({ chainId, lotId, options }: LaunchQueryConfig) => {
  const sdk = useSdk();
  const id = getLaunchId(chainId, lotId);
  const isQueryEnabled =
    chainId != null &&
    id != null &&
    (options?.enabled satisfies boolean | undefined);

  const subgraphUrl =
    sdk.config?.subgraph?.[chainId]?.url ?? deployments[chainId!].subgraphURL;

  return useGetBatchAuctionLotQuery<GetBatchAuctionLotQuery["batchAuctionLot"]>(
    { endpoint: subgraphUrl },
    { id: id! },
    {
      ...options,
      enabled: isQueryEnabled,
      select: (data) => data.batchAuctionLot,
    },
  );
};
