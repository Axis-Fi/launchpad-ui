import { useSdkQuery } from "@repo/sdk/react";
import type { Token } from "@repo/types";

const useTokenPrice = (token: Token, timestamp: number | undefined) => {
  const { data, status, error } = useSdkQuery(
    async (sdk) => (await sdk.getTokenPrice({ token, timestamp })) || null, // react-query rejects undefined
    {
      queryKey: ["get-token-price", token.address, timestamp],
      enabled: !!token?.address,
    },
  );

  if (error) {
    console.error("Error fetching token price", error);
    throw error;
  }

  return status === "success" ? data : undefined;
};

export { useTokenPrice };
