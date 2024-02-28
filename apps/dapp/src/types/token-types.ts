export type Token = {
  address: string;
  decimals: string;
  symbol: string;
  name: string;
  chainId: number;
  logoURI?: string;
};

export type TokenList = {
  name: string;
  timestamp: string;
  version: {
    major: number;
    minor: number;
    patch: number;
  };
  logoURI?: string;
  keywords?: string[];
  tokens: Token[];
};
