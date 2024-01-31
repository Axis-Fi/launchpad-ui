/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_TESTNET: string;
  readonly VITE_WALLETCONNECT_PROJECT_ID: string;
}
