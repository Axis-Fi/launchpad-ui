import { cloakServers } from "@repo/env";
import { ConfigsApi, Configuration, KeysApi } from ".";

//TODO: add environment check
const { url: serverUrl } = cloakServers.production;

const defaultConfig = new Configuration({
  basePath: serverUrl,
});

export class CloakClient {
  keysApi: KeysApi;
  configsApi: ConfigsApi;

  constructor(config: Configuration = defaultConfig) {
    this.keysApi = new KeysApi(config);
    this.configsApi = new ConfigsApi(config);
  }
}

export const createCloakClient = (config?: Configuration) =>
  new CloakClient(config);

export const cloakClient = new CloakClient();
