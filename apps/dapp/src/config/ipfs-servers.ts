import { Environment } from "./environment";

export default {
  development: {
    description: "Local",
    url: "http://localhost:4000",
  },
  testing: {
    description: "Testing",
    url: "https://ipfs-api-staging.onrender.com",
  },
  staging: {
    description: "Staging",
    url: "https://ipfs-api-staging.onrender.com",
  },
  production: {
    description: "Production",
    url: "https://axisfi-ipfs-api.onrender.com",
  },
} as Record<Environment, { description: string; url: string }>;
