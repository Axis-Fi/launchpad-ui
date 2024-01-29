import { WagmiProvider, createConfig } from "wagmi";
import { activeConfig } from "../config/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider, { connectors } from "./wallet-provider";

const queryClient = new QueryClient();

//@ts-expect-error type mismatch
const wagmiConfig = createConfig({ ...activeConfig, connectors });

export function BlockchainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>{children}</WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
