import { http } from "wagmi";
import { Chain, blastSepolia } from "viem/chains";
import { environment } from "./environment";
import { testnetDeployments, mainnetDeployments } from "@repo/deployments";
import { AxisDeployment } from "@repo/deployments/src/types";

//Mainnet Config
export const mainnets: Chain[] = testnetDeployments.map(({ chain }) => chain);
const mainnetConfig = generateConfig(testnetDeployments);

//Testnet Config
export const testnets: Chain[] = mainnetDeployments.map(({ chain }) => chain);
const testnetConfig = generateConfig(mainnetDeployments);

export const activeChains = environment.isTestnet ? testnets : mainnets;

export const activeConfig = environment.isTestnet
  ? testnetConfig
  : mainnetConfig;

//TODO: add this to deployments config
export const iconsPerChain: Record<number, string> = {
  [blastSepolia.id]: "/blast-logo.png",
};

function generateConfig(deployment: AxisDeployment[]) {
  return deployment.reduce(
    (acc, config) => {
      const chains = acc.chains;
      const transports = acc.transports;
      const rpc = config.chain.rpcUrls.axis ?? config.chain.rpcUrls.default;

      return {
        chains: [...chains, config.chain],
        transports: {
          ...transports,
          [config.chain.id]: http(rpc.http[0]),
        },
      };
    },
    { chains: [] as Chain[], transports: {} },
  );
}
