import type { Environment } from "@axis-finance/env";

const testnetURL = "https://points-api-testnet.up.railway.app";

export const pointsServers = {
  development: {
    description: "Local",
    url: testnetURL,
  },
  testing: {
    description: "Testnet",
    url: testnetURL,
  },
  staging: {
    description: "Staging",
    url: testnetURL,
  },
  production: {
    description: "Mainnet",
    url: "",
  },
} as Record<Environment, { description: string; url: string }>;
