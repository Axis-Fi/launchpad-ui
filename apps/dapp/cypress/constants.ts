const URL = "http://localhost:5173";

const PAGES = {
  HOME: "/#/",
  CREATE_LAUNCH: "/#/create/auction",
  CURATOR: "/#/curator",
  CURATORS: "/#/curators",
  REFER: "/#/refer",
  LAUNCH: "/#/168587773/0",

  /** TESTNET ONLY PAGES */
  FAUCET: "/#/faucet",
  DEPLOY: "/#/deploy",
};

const URLS = {
  HOME: URL + PAGES.HOME,
  CREATE_LAUNCH: URL + PAGES.CREATE_LAUNCH,
  CURATOR: URL + PAGES.CURATOR,
  CURATORS: URL + PAGES.CURATORS,
  REFER: URL + PAGES.REFER,
  LAUNCH: URL + PAGES.LAUNCH,

  /** TESTNET ONLY PAGES */
  FAUCET: URL + PAGES.FAUCET,
  DEPLOY: URL + PAGES.DEPLOY,
};

export { URLS };
