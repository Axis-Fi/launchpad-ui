import type { QueryKey, RefetchOptions } from "@tanstack/react-query";
import { useQueries } from "@tanstack/react-query";
import { Variables } from "graphql-request";
import { mainnetDeployments, testnetDeployments } from "@repo/deployments";
import { environment } from "@repo/env";
import { GetAuctionLotsDocument, request } from "@repo/subgraph-client";
import { useSdk } from "./use-sdk";
import type { OriginConfig } from "../../types";

const defaultSubgraphUrls = (
  environment.isTestnet ? testnetDeployments : mainnetDeployments
).map((d) => [d.chain.id, d.subgraphURL]) satisfies [number, string][];

type LaunchesQueryConfig = {
  document: typeof GetAuctionLotsDocument;
  variables?: Variables;
  queryKeyFn?: (chainId: number) => QueryKey;
};

const getSubgraphUrls = (config: OriginConfig) => {
  return Object.entries(config.subgraph ?? {}).map(([chainId, sg]) => [
    chainId,
    sg.url,
  ]);
};

export const useLaunches = <T>({
  document = GetAuctionLotsDocument,
  fields,
  variables,
  queryKeyFn,
}: LaunchesQueryConfig & {
  fields: (keyof Omit<T, "__typename">)[];
}) => {
  const sdk = useSdk();
  const subgraphUrlsFromConfig = getSubgraphUrls(sdk.config);
  const subgraphUrls = subgraphUrlsFromConfig.length
    ? subgraphUrlsFromConfig
    : defaultSubgraphUrls;

  return useQueries({
    queries: subgraphUrls.map(([chainId, subgraphUrl]) => ({
      queryKey: queryKeyFn?.(Number(chainId)) ?? [subgraphUrl],
      queryFn: () =>
        request<T>(subgraphUrl, document, {
          ...variables,
        }),
      // keepPreviousData: true,
    })),
    combine: (results) => {
      const data = results
        .filter((r) => r?.data != null)
        .flatMap((r) => fields.flatMap((field) => r.data?.[field] ?? []))
        .filter(Boolean);

      return {
        data,
        queries: results,
        refetch: (opts?: RefetchOptions) => results.map((r) => r.refetch(opts)),
        isSuccess: results.some((r) => r.isSuccess),
        isRefetching: results.some((r) => r.isFetching),
        isLoading: results.some((r) => r.isLoading),
        isError: results.some((r) => r.isError),
        errors: results.filter((r) => r.isError).map((r) => r.error),
      };
    },
  });
};
