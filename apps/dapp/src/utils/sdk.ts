import { createSdk, OriginSdk } from "@axis-finance/sdk";
import { getCloakServer, getCuratorServer } from "@axis-finance/env";
import { environment } from "utils/environment";

const fleekApplicationClientId = import.meta.env
  .VITE_FLEEK_APPLICATION_CLIENT_ID;

export const sdk: OriginSdk = createSdk({
  environment: environment.current,
  cloak: {
    url: getCloakServer(environment.current).url,
  },
  metadata: {
    fleekApplicationClientId,
  },
  curator: {
    url: getCuratorServer(environment.current).url,
  },
});
