import { Address } from "viem";

export type Token = {
  chainId: number;
  address: Address;
  symbol: string;
  decimals: number;
  name?: string;
  logoURI?: string;
};

//Tokenlist Standard
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
  //App specific
  isActive?: boolean;
};
