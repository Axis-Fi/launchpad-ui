import { Environment } from "./environment";

const testnetURL = "https://points-api-testnet.railway.app";

export default {
  development: {
    description: "Local",
    url: "http://localhost:8081",
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
