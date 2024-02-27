import { http } from "wagmi";
import { Chain, blastSepolia, mainnet } from "viem/chains";
import { environment } from "./environment";
import { testnetList } from "@repo/deployments";
import { AxisDeployment } from "@repo/deployments/src/types";

//Mainnet Config
export const mainnets: [Chain, ...Chain[]] = [mainnet];
const mainnetConfig = {
  chains: mainnets,
  transports: {
    [mainnet.id]: http(""),
  },
};

//Testnet Config
export const testnets: Chain[] = testnetList.map(({ chain }) => chain);
const testnetConfig = generateConfig(testnetList);

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
