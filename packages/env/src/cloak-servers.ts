import { Environment } from "./environment";

const v2URL = "https://api-testnet-v2.up.railway.app";

export default {
  development: {
    description: "Local",
    url: "http://localhost:8080",
  },
  testing: {
    description: "Testnet",
    url: v2URL,
  },
  staging: {
    description: "Staging",
    url: v2URL,
  },
  production: {
    description: "Mainnet",
    url: "https://cloak-api-mainnet.up.railway.app",
  },
} as Record<Environment, { description: string; url: string }>;
