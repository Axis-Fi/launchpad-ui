import { AxisContractAddresses } from "@repo/types";
import { allDeployments } from "./main";
import { abis } from "@repo/abis";

const addressesPerChain: Record<number, AxisContractAddresses> = allDeployments
  .flat()
  .reduce((acc, deployment) => {
    return { ...acc, [deployment.chain.id]: deployment.addresses };
  }, {});

export const axisContracts = {
  addresses: addressesPerChain,
  abis,
};
