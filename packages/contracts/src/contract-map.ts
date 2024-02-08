import { AxisContractAddresses, AxisContracts } from "./types";
import abis from "./abis";
import { addressesPerChain } from "./addresses";

/* Matches abis with contracts by chain*/
function mapAbis(addresses: AxisContractAddresses) {
  const names = Object.keys(addresses);

  return names.reduce(
    (acc, name) => ({
      ...acc,
      [name]: {
        address: addresses[name],
        abi: abis[name],
      },
    }),
    {},
  );
}

function mapContractsByChain() {
  const chains = Object.keys(addressesPerChain);

  return chains.reduce((acc, chainId) => {
    return {
      ...acc,
      [chainId]: mapAbis(addressesPerChain[chainId]),
    };
  }, {});
}

/* Axis Contracts by chain */
export const axisContracts: AxisContracts = mapContractsByChain();
