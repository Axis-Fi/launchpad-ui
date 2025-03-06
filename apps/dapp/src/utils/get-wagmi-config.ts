import { custom } from "viem";
import { createConfig, type Config } from "wagmi";
import { baseSepolia } from "wagmi/chains";
import { chains } from "@axis-finance/env";
import { injectAutoSignerProvider } from "@axis-finance/auto-signer-provider";
import { environment } from "utils/environment";
import { connectors } from "utils/rainbow-kit-connectors";

const getWagmiConfig = (): Config => {
  if (import.meta.env.VITE_ENABLE_AUTOSIGNING_WALLET === "true") {
    injectAutoSignerProvider({
      debug: false,
      rpcUrl: "http://127.0.0.1:8545",
      chain: baseSepolia,
      privateKey:
        "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    });

    return createConfig({
      chains: [baseSepolia],
      transports: {
        [baseSepolia.id]: custom(window.ethereum),
      },
      connectors,
    });
  }

  const activeConfig = chains.activeConfig(environment.isTestnet);
  //@ts-expect-error activeConfig is basically the same
  return createConfig({ ...activeConfig, connectors });
};

export { getWagmiConfig };
