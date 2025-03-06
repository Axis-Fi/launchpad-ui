import { hashFn } from "wagmi/query";
import { WagmiProvider } from "wagmi";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WalletProvider from "./wallet-provider";
import { getWagmiConfig } from "utils/get-wagmi-config";

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

const wagmiConfig = getWagmiConfig();

export function BlockchainProvider({
  children,
  disableDevTools,
}: {
  children: React.ReactNode;
  disableDevTools?: boolean;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>{children}</WalletProvider>
        {!disableDevTools && <ReactQueryDevtools />}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
