import { cloakServers, environment } from ".";

const getCloakServer = () =>
  cloakServers[environment.current] ?? cloakServers.testing;

export { getCloakServer };
