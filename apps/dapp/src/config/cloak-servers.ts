import { Environment } from "./environment";

export default {
  development: {
    description: "Local",
    url: "http://localhost:8080",
  },
  testing: {
    description: "Testnet",
    url: "https://api-testnet-d2e7.up.railway.app",
  },
  staging: {
    description: "Testnet",
    url: "https://cloak-api-mainnet.up.railway.app",
  },
  production: {
    description: "Mainnet",
    url: "https://cloak-api-mainnet.up.railway.app",
  },
} as Record<Environment, { description: string; url: string }>;
