import { http } from "wagmi";
import { environment } from "./environment";
import { Chain } from "@repo/types";
import { testnetDeployments, mainnetDeployments } from "@repo/deployments";
import { AxisDeployment } from "@repo/deployments/src/types";

//Mainnet Config
export const mainnets: Chain[] = testnetDeployments.map(({ chain }) => chain);
const mainnetConfig = generateConfig(mainnetDeployments);

//Testnet Config
export const testnets: Chain[] = testnetDeployments.map(({ chain }) => chain);
const testnetConfig = generateConfig(testnetDeployments);

export const activeChains = (environment.isTestnet ? testnets : mainnets).sort(
  (a, b) => a.name.localeCompare(b.name),
);

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
        iconBackground: "#000",
      } as const satisfies Chain;

      return {
        chains: [...chains, chain].sort((c, other) =>
          c.name.localeCompare(other.name),
        ),
        transports: {
          ...transports,
          [config.chain.id]: http(rpc.http[0]),
        },
      };
    },
    { chains: [] as Chain[], transports: {} },
  );
}
