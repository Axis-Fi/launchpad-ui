import { hashFn } from "wagmi/query";
import { WagmiProvider, createConfig } from "wagmi";
import { chains } from "@repo/env";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider, { connectors } from "./wallet-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const activeConfig = chains.activeConfig;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /*
        TanStack Query can't handle bigint queryKey data type by default.
        Wagmi hashFn handles bigints for this purpose.
      */
      queryKeyHashFn: hashFn,
      refetchOnWindowFocus: false,
    },
  },
});

//@ts-expect-error type mismatch
const wagmiConfig = createConfig({ ...activeConfig, connectors });

export function BlockchainProvider({
  children,
  disableDevTools,
}: {
  children: React.ReactNode;
  disableDevTools?: boolean;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <WalletProvider>{children}</WalletProvider>
        {!disableDevTools && <ReactQueryDevtools />}
      </WagmiProvider>
    </QueryClientProvider>
  );
}
