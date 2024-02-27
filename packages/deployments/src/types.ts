import { type Chain } from "viem/chains";
import { Address, AxisContractAddresses } from "@repo/contracts";

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
  tokenList: Token[];
  subgraphURL: string;
  addresses: AxisContractAddresses;
};

/** Raw deployment configuration to be used to generate the final config*/
export type AxisDeploymentConfig = Omit<
  AxisDeployment,
  "subgraphURL" | "tokenList"
> & {
  rpcURL: string;
  tokenList: Omit<Token, "chainId">[];
};
