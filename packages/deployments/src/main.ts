import type { TokenList, AxisContractAddresses } from "@repo/types";
import { abis } from "@repo/abis";
import { createDeployment, createDeploymentRecord } from "./deployment-creator";
import testnetConfigs from "../chains/testnet";
//import mainnetConfigs from "../chains/mainnet";

//Transforms config files into deployment objects
//TODO: REPLACE THIS ONCE THERE'S MAINNETS
export const mainnetDeployments = testnetConfigs.map(createDeployment);
export const testnetDeployments = testnetConfigs.map(createDeployment);

export const allDeployments = [testnetDeployments, mainnetDeployments];

const addressesPerChain: Record<number, AxisContractAddresses> = allDeployments
  .flat()
  .reduce((acc, deployment) => {
    return { ...acc, [deployment.chain.id]: deployment.addresses };
  }, {});

export const axisContracts = {
  addresses: addressesPerChain,
  abis,
};

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
