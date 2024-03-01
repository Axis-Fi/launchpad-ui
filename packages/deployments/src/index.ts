import { createDeployment, createDeploymentRecord } from "./deployment-creator";
import testnetConfigs from "../chains/testnet";
import mainnetConfigs from "../chains/mainnet";
import { TokenList } from "./types";

//Transforms config files into deployment objects
export const testnetList = testnetConfigs.map(createDeployment);
export const mainnetList = mainnetConfigs.map(createDeployment);

//Indexes deployments by chain for ease of use
export const testnets = createDeploymentRecord(testnetList);
export const mainnets = createDeploymentRecord(mainnetList);

const allList = [testnetList, mainnetList].flatMap((list) =>
  list.flatMap((t) => t.tokenList),
);

export const defaultTokenlist = compileTokenList(allList);

function compileTokenList(tokenlist: TokenList[]) {
  const [metadata] = tokenlist;

  return {
    ...metadata,
    isActive: true,
    tokens: tokenlist.flatMap((l) => l.tokens),
  };
}
