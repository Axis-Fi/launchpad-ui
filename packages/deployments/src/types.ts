import { type Chain } from "viem/chains";
import { Address, AxisContractAddresses } from "@repo/abis";

/** Tokenlist's Token Definition */
export type Token = {
  chainId: number;
  address: Address;
  symbol: string;
  decimals: number;
  name?: string;
  logoURI?: string;
};

/** Describes an Axis Deployment per chain */
export type AxisDeployment = {
  chain: Chain;
  tokenList: TokenList;
  subgraphURL: string;
  addresses: AxisContractAddresses;
};

/** Raw deployment data used to generate the final config*/
export type AxisDeploymentConfig = Omit<
  AxisDeployment,
  "subgraphURL" | "tokenList"
> & {
  rpcURL: string;
  tokenList: Omit<Token, "chainId">[];
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
