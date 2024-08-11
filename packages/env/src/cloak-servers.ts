import { Environment } from "./environment";

const v3URL = "https://api-testnet-v3.up.railway.app";

export default {
  development: {
    description: "Local",
    url: "http://localhost:8080",
  },
  testing: {
    description: "Testnet",
    url: v3URL,
  },
  staging: {
    description: "Staging",
    url: v3URL,
  },
  production: {
    description: "Mainnet",
    url: "https://api-production-8b39.up.railway.app",
  },
} as Record<Environment, { description: string; url: string }>;
