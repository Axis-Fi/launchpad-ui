import cloakServers from "config/cloak-servers";
import { ConfigsApi, Configuration, KeysApi } from ".";
import { environment } from "config/environment";

const { url: serverUrl } =
  cloakServers[environment.current] ?? cloakServers.testing;

const config = new Configuration({
  basePath: serverUrl,
});

class CloakClient {
  keysApi: KeysApi;
  configsApi: ConfigsApi;

  constructor() {
    this.keysApi = new KeysApi(config);
    this.configsApi = new ConfigsApi(config);
  }
}

export const cloakClient = new CloakClient();
