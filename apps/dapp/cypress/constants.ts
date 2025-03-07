const BASE_URL = Cypress.env("VITE_APP_URL");

// Mainnet chain ID for mainnet build testing
const blastSepoliaChainId = "168587773";

// Testnet chain ID for testnet build testing
const baseChainId = "8453";

const LAUNCH_ID =
  Cypress.env("VITE_TESTNET") === "true" ? blastSepoliaChainId : baseChainId;

const URLS = {
  HOME: `${BASE_URL}/#/`,
  CREATE_LAUNCH: `${BASE_URL}/#/create/auction`,
  CURATOR: `${BASE_URL}/#/curator`,
  CURATORS: `${BASE_URL}/#/curators`,
  REFERRALS: `${BASE_URL}/#/refer`,
  LAUNCH: `${BASE_URL}/#/${LAUNCH_ID}/0`,

  /** TESTNET ONLY PAGES */
  FAUCET: `${BASE_URL}/#/faucet`,
  DEPLOY: `${BASE_URL}/#/deploy`,
} as const;

const COMPONENTS = {
  DIALOG_SUBMIT_BUTTON: "[data-testid='dialog-submit']",
  BLOCK_EXPLORER_LINK: "[data-testid='block-explorer-link']",
  TOKEN_PICKER: {
    ADDRESS_FIELD: "[data-testid='token-picker-address']",
    LOGO_FIELD: "[data-testid='token-picker-logo']",
  },
  DEPLOY: {
    TOKEN_NAME_FIELD: "[data-testid='deploy-token-name']",
    TOKEN_SYMBOL_FIELD: "[data-testid='deploy-token-symbol']",
    SUCCESS_MESSAGE: "[data-testid='deploy-success-message']",
    DEPLOY_BUTTON: "[data-testid='deploy-button']",
  },
  CREATE_LAUNCH: {
    NAME_FIELD: "[data-testid='create-launch-name']",
    TAGLINE_FIELD: "[data-testid='create-launch-tagline']",
    PROJECT_LOGO_FIELD: "[data-testid='create-launch-project-logo']",
    PROJECT_BANNER_FIELD: "[data-testid='create-launch-project-banner']",
    WEBSITE_FIELD: "[data-testid='create-launch-website']",
    DISCORD_FIELD: "[data-testid='create-launch-discord']",
    TWITTER_FIELD: "[data-testid='create-launch-twitter']",
    FARCASTER_FIELD: "[data-testid='create-launch-farcaster']",
    DESCRIPTION_FIELD: "[data-testid='create-launch-description']",
    PAYOUT_TOKEN_FIELD: "[data-testid='create-launch-payout-token']",
    QUOTE_TOKEN_FIELD: "[data-testid='create-launch-quote-token']",
    QUOTE_TOKEN_PICKER: (tokenSymbol: string) =>
      `[token-select-dialog-token-${tokenSymbol}]`,
    CAPACITY_FIELD: "[data-testid='create-launch-capacity']",
    PRICE_FIELD: "[data-testid='create-launch-price']",
    START_FIELD: "[data-testid='create-launch-start']",
    DEADLINE_FIELD: "[data-testid='create-launch-deadline']",
  },
};

const TIME = {
  TEN_SECONDS: 10 * 1000,
  FIVE_MINUTES: 5 * 60 * 1000,
};

const TRANSACTION_TIMEOUT_MS = TIME.TEN_SECONDS;

export { URLS, COMPONENTS, TIME, TRANSACTION_TIMEOUT_MS };
