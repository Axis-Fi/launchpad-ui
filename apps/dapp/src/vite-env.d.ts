/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_TESTNET: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
  readonly VITE_FLEEK_APPLICATION_CLIENT_ID: string;
  readonly VITE_ENABLE_MOCK_SUBGRAPH: string;
  readonly VITE_APP_URL: string;
  readonly VITE_DISABLE_REACT_QUERY_DEV_TOOLS: string;
  readonly VITE_ENABLE_AUTOSIGNING_WALLET: string;
}
