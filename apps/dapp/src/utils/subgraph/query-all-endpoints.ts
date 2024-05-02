import { request } from "./request";
import { Variables } from "graphql-request";
import { environment } from "@repo/env";
import { mainnetDeployments, testnetDeployments } from "@repo/deployments";

const isTestnet = environment.isTestnet;
const endpoints = isTestnet ? testnetDeployments : mainnetDeployments;

export function queryAllEndpoints<TQuery>({
  document,
  variables = {},
}: {
  document: string;
  variables?: Variables;
}) {
  return endpoints.map(({ subgraphURL: url }) => ({
    queryKey: [url, document, variables],
    queryFn: async () => {
      const response = await request<TQuery>(url, document, variables);
      return response;
    },
  }));
}
