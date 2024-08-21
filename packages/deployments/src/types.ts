import type {
  Token,
  TokenList,
  AxisContractAddresses,
  Chain,
  AxisCallbackAddresses,
  Address,
} from "@repo/types";

/** Describes an Axis Deployment per chain */
export type AxisDeployment = {
  name: string;
  chain: Chain;
  tokenList: TokenList;
  subgraphURL: string;
  addresses: AxisContractAddresses;
  callbacks?: AxisCallbackAddresses;
  dexURL?: string;
};

/** Raw deployment data used to generate the final config*/
export type AxisDeploymentConfig = Omit<AxisDeployment, "tokenList"> & {
  name: string;
  rpcURL: string;
  tokenList: Omit<Token, "chainId">[];
  chainIconUrl?: string;
  dexURL?: string;
  wrapperContract?: Address;
};

export type AxisDeployments = Record<number, AxisDeployment>;
