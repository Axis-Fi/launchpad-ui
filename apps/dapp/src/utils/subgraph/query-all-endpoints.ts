import { request } from "./request";
import { Variables } from "graphql-request";
import { environment } from "config/environment";
import { mainnetDeployments, testnetDeployments } from "@repo/deployments";

export function queryAllEndpoints<TQuery>({
  document,
  variables,
}: {
  document: string;
  variables?: Variables;
}) {
  const isTestnet = environment.isTestnet;
  const endpoints = isTestnet ? testnetDeployments : mainnetDeployments;
  const currentTime = Math.trunc(Date.now() / 1000);

  const vars = variables || { currentTime };

  const queries = endpoints.map(({ subgraphURL: url }) => ({
    queryKey: [url, document, vars],
    queryFn: async () => {
      const response = await request<TQuery>(url, document, vars);
      return response;
    },
  }));

  return queries;
}
