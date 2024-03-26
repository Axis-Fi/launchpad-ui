import { WagmiProvider, createConfig } from "wagmi";
import { activeConfig } from "../config/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider, { connectors } from "./wallet-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

//@ts-expect-error type mismatch
const wagmiConfig = createConfig({ ...activeConfig, connectors });

export function BlockchainProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <WalletProvider>{children}</WalletProvider>
        <ReactQueryDevtools />
      </WagmiProvider>
    </QueryClientProvider>
  );
}
