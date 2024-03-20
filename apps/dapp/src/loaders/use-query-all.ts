import {
  RefetchOptions,
  UseQueryResult,
  useQueries,
} from "@tanstack/react-query";
import { Variables } from "graphql-request";
import { queryAllEndpoints } from "utils/subgraph/query-all-endpoints";

/** Queries all configured endpoints */
export function useQueryAll<TQuery>({
  document,
  variables,
  field,
}: {
  document: string;
  variables?: Variables;
  field: QueryResultKey<TQuery>;
}) {
  const queries = useQueries({
    queries: queryAllEndpoints<TQuery>({ document, variables }),
    combine: (responses) => {
      const filteredResponses = responses.filter(
        (response): response is UseQueryResult<TQuery> =>
          response?.data !== undefined,
      );

      return {
        data: concatSubgraphQueryResultArrays<TQuery, QueryResultKey<TQuery>>(
          filteredResponses,
          field,
        ),
        queries: responses,
        refetch: (args: RefetchOptions | undefined) =>
          responses.flatMap((r) => r.refetch(args)),
        isSuccess: responses.some((r) => r.isSuccess),
        isRefetching: responses.some((r) => r.isFetching),
        isLoading: responses.some((r) => r.isLoading),
        isError: responses.some((r) => r.isError),
        errors: responses.filter((r) => r.isError).map(({ error }) => error),
      };
    },
  });
  return queries;
}

type QueryResultKey<T> = keyof Omit<T, "__typename">;

export const concatSubgraphQueryResultArrays = <T, K extends QueryResultKey<T>>(
  queries: UseQueryResult<T, unknown>[],
  fieldName: K,
) => {
  return queries
    .filter((value) => !value.isError)
    .map((value) => (value.data as T)[fieldName])
    .filter(
      (fieldArray): fieldArray is NonNullable<T[K]> => fieldArray !== undefined,
    )
    .flat();
};
