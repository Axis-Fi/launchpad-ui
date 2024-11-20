import { cloakServers, environment, ipfsServers } from ".";

const getCloakServer = () =>
  cloakServers[environment.current] ?? cloakServers.testing;

const getMetadataServer = () =>
  ipfsServers[environment.current] ?? ipfsServers.testing;

export { getCloakServer, getMetadataServer };
