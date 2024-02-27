import { createDeployment, createDeploymentRecord } from "./deployment-creator";
import testnetConfigs from "../chains/testnet";
import mainnetConfigs from "../chains/mainnet";

//Transforms config files into deployment objects
export const testnetList = testnetConfigs.map(createDeployment);
export const mainnetList = mainnetConfigs.map(createDeployment);

//Indexes deployments by chain for ease of use
export const testnets = createDeploymentRecord(testnetList);
export const mainnets = createDeploymentRecord(mainnetList);
