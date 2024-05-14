import type { TokenList } from "@repo/types";
import { createDeployment, createDeploymentRecord } from "./deployment-creator";
import testnetConfigs from "../chains/testnet";
import mainnetConfigs from "../chains/mainnet";

//Transforms config files into deployment objects
//TODO: REPLACE THIS ONCE THERE'S MAINNETS
export const mainnetDeployments = mainnetConfigs.map(createDeployment);
export const testnetDeployments = testnetConfigs.map(createDeployment);

export const allDeployments = [testnetDeployments, mainnetDeployments];

//Indexes deployments by chain for ease of use
export const testnets = createDeploymentRecord(mainnetDeployments);
export const mainnets = createDeploymentRecord(testnetDeployments);
export const deployments = { ...testnets, ...mainnets };

const lists = [mainnetDeployments, testnetDeployments].flatMap((list) =>
  list.flatMap((t) => t.tokenList),
);

export const defaultTokenlist = compileTokenList(lists);

function compileTokenList(tokenlist: TokenList[]) {
  const [metadata] = tokenlist;

  return {
    ...metadata,
    isActive: true,
    tokens: tokenlist.flatMap((l) => l.tokens),
  };
}
