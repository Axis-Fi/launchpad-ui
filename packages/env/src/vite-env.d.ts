/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_TESTNET: string;
  readonly VITE_MOCK_BACKEND: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
