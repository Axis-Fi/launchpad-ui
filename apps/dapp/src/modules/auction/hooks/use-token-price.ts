import { useSdkQuery } from "@repo/sdk/react";

const useTokenPrice = (chainId: number, symbol: string) => {
  const { data, status, error } = useSdkQuery(
    sdk => sdk.getTokenPrice({ chainId, tokenSymbol: symbol }),
    {
      queryKey: ["get-token-price", chainId, symbol],
      enabled: !!chainId && !!symbol,
    }
  );
  
  if (error) {
    throw error;
  }

  return (status === "success") ? data : undefined;
}

export {
  useTokenPrice,
};