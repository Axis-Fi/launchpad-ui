const BASE_URL = "http://localhost:5173" as const;

const URLS = {
  HOME: `${BASE_URL}/#/`,
  CREATE_LAUNCH: `${BASE_URL}/#/create/auction`,
  CURATOR: `${BASE_URL}/#/curator`,
  CURATORS: `${BASE_URL}/#/curators`,
  REFER: `${BASE_URL}/#/refer`,
  LAUNCH: `${BASE_URL}/#/168587773/0`,

  /** TESTNET ONLY PAGES */
  FAUCET: `${BASE_URL}/#/faucet`,
  DEPLOY: `${BASE_URL}/#/deploy`,
} as const;

export { URLS };
