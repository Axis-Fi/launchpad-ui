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

const testId = (id: string) => `[data-testid='${id}']`;

const COMPONENTS = {
  DATE_PICKER: {
    CALENDAR_DAY_BUTTON: "button[name='day']",
    TIME_FIELD: testId("date-picker-time"),
    CONFIRM_BUTTON: testId("date-picker-confirm"),
  },
  SELECT_ITEM: (label: string) => testId(`select-item-${label}`),
  DIALOG_SUBMIT_BUTTON: testId("dialog-submit"),
  BLOCK_EXPLORER_LINK: testId("block-explorer-link"),
  TOKEN_PICKER: {
    ADDRESS_FIELD: testId("token-picker-address"),
    LOGO_FIELD: testId("token-picker-logo"),
  },
  DEPLOY: {
    TOKEN_NAME_FIELD: testId("deploy-token-name"),
    TOKEN_SYMBOL_FIELD: testId("deploy-token-symbol"),
    SUCCESS_MESSAGE: testId("deploy-success-message"),
    DEPLOY_BUTTON: testId("deploy-button"),
  },
  MINT: {
    AMOUNT_FIELD: testId("mint-amount"),
    MINT_BUTTON: testId("mint-button"),
    SUCCESS_MESSAGE: testId("mint-success-message"),
  },
  CREATE_LAUNCH: {
    NAME_FIELD: testId("create-launch-name"),
    TAGLINE_FIELD: testId("create-launch-tagline"),
    PROJECT_LOGO_FIELD: testId("create-launch-project-logo"),
    PROJECT_BANNER_FIELD: testId("create-launch-project-banner"),
    WEBSITE_FIELD: testId("create-launch-website"),
    DISCORD_FIELD: testId("create-launch-discord"),
    TWITTER_FIELD: testId("create-launch-twitter"),
    FARCASTER_FIELD: testId("create-launch-farcaster"),
    DESCRIPTION_FIELD: testId("create-launch-description"),
    PAYOUT_TOKEN_FIELD: testId("create-launch-payout-token"),
    QUOTE_TOKEN_FIELD: testId("create-launch-quote-token"),
    QUOTE_TOKEN_PICKER: (tokenSymbol: string) =>
      testId(`token-select-dialog-token-${tokenSymbol}`),
    START_FIELD: testId("create-launch-start"),
    NEXT_MONTH_BUTTON: "button[name='next-month']",
    DEADLINE_FIELD: testId("create-launch-deadline"),
    AUCTION_TYPE_FIELD: testId("create-launch-auction-type"),
    CAPACITY_FIELD: testId("create-launch-capacity"),
    PRICE_FIELD: testId("create-launch-price"),
    DEPLOY_BUTTON: testId("create-launch-deploy-button"),
    CREATE_BUTTON: testId("create-launch-create-button"),
    SUBMIT_BUTTON: testId("create-launch-submit-button"),
    SUCCESS_BUTTON: testId("create-launch-success-button"),
  },
};

const TIME = {
  TRANSACTION_TIMEOUT: 10 * 1000,
};

export { URLS, COMPONENTS, TIME };
