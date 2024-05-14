import { useSdkQuery } from "@repo/sdk/react";
import type { Token } from "@repo/types";

const useTokenPrice = (token: Token, timestamp: number | undefined) => {
  const { data, status, error } = useSdkQuery(
    (sdk) => sdk.getTokenPrice({ token, timestamp }),
    {
      queryKey: ["get-token-price", token.address, timestamp],
      enabled: !!token?.address,
    },
  );

  if (error) {
    throw error;
  }

  return status === "success" ? data : undefined;
};

export { useTokenPrice };
