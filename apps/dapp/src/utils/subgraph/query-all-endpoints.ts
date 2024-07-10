import { Variables } from "graphql-request";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import { environment } from "@repo/env";
import {
  type AxisDeployment,
  mainnetDeployments,
  testnetDeployments,
} from "@repo/deployments";
import { isCacheStale } from "modules/auction/utils/is-cache-stale";
import { request } from "./request";
import type { MaybeOptimistic } from "@repo/types";

const isTestnet = environment.isTestnet;
const endpoints = isTestnet ? testnetDeployments : mainnetDeployments;

type QueryKeyFn = (deployment: AxisDeployment) => QueryKey;

type QueryAllEndpointsParams = {
  document: string;
  variables?: Variables;
  queryKeyFn?: QueryKeyFn;
  queryClient: QueryClient;
};

export function queryAllEndpoints<TQuery>({
  document,
  variables = {},
  queryKeyFn,
  queryClient,
}: QueryAllEndpointsParams) {
  return endpoints.map((deployment) => {
    const { subgraphURL: url } = deployment;
    const queryKey = queryKeyFn
      ? queryKeyFn(deployment)
      : [url, document, variables];

    const cachedAuctionData =
      queryClient.getQueryData<MaybeOptimistic>(queryKey);
    const enabled = isCacheStale(cachedAuctionData);

    return {
      // eslint-disable-next-line @tanstack/query/exhaustive-deps
      queryKey,
      queryFn: async () => {
        const response = await request<TQuery>(url, document, variables);
        return response;
      },
      enabled,
    };
  });
}

export type { QueryKeyFn, QueryKey };
