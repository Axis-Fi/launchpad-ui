import type { QueryKey, RefetchOptions } from "@tanstack/react-query";
import { useQueries } from "@tanstack/react-query";
import { Variables } from "graphql-request";
import { mainnetDeployments, testnetDeployments } from "@repo/deployments";
import { environment } from "@repo/env";
import { GetAuctionLotsDocument, request } from "@repo/subgraph-client";
import type { GetAuctionLots } from "@repo/types";
import { useSdk } from "./use-sdk";

const defaultSubgraphUrls = (
  environment.isTestnet ? testnetDeployments : mainnetDeployments
).map((d) => [d.chain.id, d.subgraphURL]) satisfies [number, string][];

type LaunchesQueryConfig<T> = {
  chainIds?: number[];
  document: typeof GetAuctionLotsDocument;
  variables?: Variables;
  fields: (keyof T)[];
  queryKeyFn?: (chainId: number) => QueryKey;
};

const defaultQueryConfig: LaunchesQueryConfig<GetAuctionLots> = {
  document: GetAuctionLotsDocument,
  fields: ["batchAuctionLots"],
  variables: {},
  queryKeyFn: (chainId: number) => ["launches", chainId] as const,
};

export const useLaunches = <T>(
  queryConfig?: Partial<LaunchesQueryConfig<T>>,
) => {
  const { chainIds, document, fields, variables, queryKeyFn } = {
    ...defaultQueryConfig,
    ...queryConfig,
  };

  const sdk = useSdk();

  const subgraphUrls = defaultSubgraphUrls
    .map(([chainId, subgraphUrl]) => {
      return [
        chainId,
        sdk.config.subgraph?.[chainId]?.url || subgraphUrl,
      ] satisfies [number, string];
    })
    // Ignore chains which the consumer isn't interested in
    .filter(([chainId]) => chainIds == null || chainIds?.includes(chainId));

  return useQueries({
    queries: subgraphUrls.map(([chainId, subgraphUrl]) => ({
      queryKey: queryKeyFn?.(chainId) ?? [subgraphUrl],
      queryFn: () =>
        request<T>(subgraphUrl, document, {
          ...variables,
          chainId,
        }),
    })),
    combine: (results) => {
      const data = results
        .filter((r) => r?.data != null)
        .flatMap((r) =>
          fields.flatMap((field) => r.data?.[field as keyof T] ?? []).flat(),
        )
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
