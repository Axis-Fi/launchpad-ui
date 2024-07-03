import { Variables } from "graphql-request";
import type { QueryClient } from "@tanstack/react-query";
import { environment } from "@repo/env";
import {
  type AxisDeployment,
  mainnetDeployments,
  testnetDeployments,
} from "@repo/deployments";
import type { AuctionsQuery } from "@repo/types";
import { hasOptimisticStaleTimeExpired } from "modules/auction/utils/has-optimistic-stale-time-expired";
import { request } from "./request";

const isTestnet = environment.isTestnet;
const endpoints = isTestnet ? testnetDeployments : mainnetDeployments;

type QueryKeyFn = (
  deployment: AxisDeployment,
) => (string | number | Variables)[];

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
    const cachedAuctionData = queryClient.getQueryData<AuctionsQuery>(queryKey);
    const enabled = hasOptimisticStaleTimeExpired(cachedAuctionData);

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

export type { QueryKeyFn };
