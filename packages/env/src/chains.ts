import { http } from "wagmi";
import { Chain } from "@repo/types";
import { testnetDeployments, mainnetDeployments } from "@repo/deployments";
import type { AxisDeployment } from "@repo/deployments/src/types";

//Mainnet Config
export const mainnets: Chain[] = mainnetDeployments.map(({ chain }) => chain);
export const mainnetConfig = generateConfig(mainnetDeployments);

//Testnet Config
export const testnets: Chain[] = testnetDeployments.map(({ chain }) => chain);
export const testnetConfig = generateConfig(testnetDeployments);

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
