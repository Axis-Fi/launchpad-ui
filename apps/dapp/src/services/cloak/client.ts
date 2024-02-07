import { ConfigsApi, KeysApi } from ".";

class CloakClient {
  keysApi: KeysApi;
  configsApi: ConfigsApi;

  constructor() {
    //TODO: add server/environment distinction
    this.keysApi = new KeysApi();
    this.configsApi = new ConfigsApi();
  }
}

export const cloakClient = new CloakClient();
