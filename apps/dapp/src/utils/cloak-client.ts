import { Environment, cloakServers } from "@axis-finance/env";
import { Configuration, createCloakClient } from "@axis-finance/cloak";

const env =
  (import.meta.env.VITE_ENVIRONMENT as Environment) || Environment.PRODUCTION;

const cloakClient = createCloakClient(
  new Configuration({
    basePath: cloakServers[env].url,
  }),
);

export { cloakClient };
