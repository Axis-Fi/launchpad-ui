import { Environment } from "./environment";

export default {
  development: {
    description: "Local",
    url: "http://localhost:4000",
  },
  testing: {
    description: "Testing",
    url: "",
  },
  staging: {
    description: "Staging",
    url: "",
  },
  production: {
    description: "Production",
    url: "",
  },
} as Record<Environment, { description: string; url: string }>;
