import { http } from "wagmi";
import { Chain, blastSepolia, modeTestnet } from "viem/chains";
import { environment } from "./environment";
import { testnetDeployments, mainnetDeployments } from "@repo/deployments";
import { AxisDeployment } from "@repo/deployments/src/types";

//TODO: add this to deployments config
export const iconsPerChain: Record<number, string> = {
  [blastSepolia.id]: "/blast-logo.png",
  [modeTestnet.id]: "/mode-logo.svg",
};

//Mainnet Config
export const mainnets: Chain[] = testnetDeployments.map(({ chain }) => chain);
const mainnetConfig = generateConfig(mainnetDeployments);

//Testnet Config
export const testnets: Chain[] = testnetDeployments.map(({ chain }) => chain);
const testnetConfig = generateConfig(testnetDeployments);

export const activeChains = environment.isTestnet ? testnets : mainnets;

export const activeConfig = environment.isTestnet
  ? testnetConfig
  : mainnetConfig;

function generateConfig(deployment: AxisDeployment[]) {
  return deployment.reduce(
    (acc, config) => {
      const chains = acc.chains;
      const transports = acc.transports;
      const rpc = config.chain.rpcUrls.axis ?? config.chain.rpcUrls.default;
      const chain = {
        ...config.chain,
        iconUrl: iconsPerChain[config.chain.id],
      };

      return {
        chains: [...chains, chain],
        transports: {
          ...transports,
          [config.chain.id]: http(rpc.http[0]),
        },
      };
    },
    { chains: [] as Chain[], transports: {} },
  );
}
