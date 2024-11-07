import type { UseQueryResult } from "@tanstack/react-query";
import {
  type GetBatchAuctionLotQuery,
  useGetBatchAuctionLotQuery,
} from "@repo/subgraph-client";
import { deployments } from "@repo/deployments";
import { getLaunchId } from "../../core/utils";
import { useSdk } from "./use-sdk";

export const useLaunch = (chainId: number, lotId: number) => {
  const sdk = useSdk();
  const id = getLaunchId(chainId, lotId);
  const isQueryEnabled = chainId != null && id != null;

  const subgraphUrl =
    sdk.config?.subgraph?.[chainId]?.url ?? deployments[chainId!].subgraphURL;

  const { data, ...rest }: UseQueryResult<GetBatchAuctionLotQuery> =
    useGetBatchAuctionLotQuery(
      {
        endpoint: subgraphUrl,
      },
      { id: id! },
      { enabled: isQueryEnabled },
    );

  return {
    data: data?.batchAuctionLot,
    ...rest,
  };
};
