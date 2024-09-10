import { Environment } from "./environment";

const testnetURL = "https://points-api-testnet.up.railway.app";

export default {
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
