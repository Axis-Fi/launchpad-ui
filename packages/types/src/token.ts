import { Address } from "viem";

export type TokenBase = {
  chainId: number;
  address: Address;
};

/** Tokenlist's Token Definition */
export type Token = TokenBase & {
  symbol: string;
  decimals: number;
  name: string;
  logoURI?: string;
  mintable?: boolean;
  totalSupply?: string;
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
