const env = import.meta.env.VITE_ENVIRONMENT;
const testnet = import.meta.env.VITE_TESTNET;

export enum Environment {
  PRODUCTION = "production",
  STAGING = "staging",
  TESTING = "testing",
  DEVELOPMENT = "development",
}

export const environment = Object.freeze({
  isProduction: env === Environment.PRODUCTION,
  isStaging: env === Environment.STAGING,
  isTesting: env === Environment.TESTING,
  isDevelopment: env === Environment.DEVELOPMENT,
  isTestnet: testnet === "true",
  current: env as Environment,
});
