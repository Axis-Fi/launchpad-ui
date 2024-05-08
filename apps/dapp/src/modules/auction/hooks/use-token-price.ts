import { useSdkQuery } from "@repo/sdk/react";
import type { Token } from "@repo/types";

const useTokenPrice = (token: Token) => {
  const { data, status, error } = useSdkQuery(
    (sdk) => sdk.getTokenPrice({ token }),
    {
      queryKey: ["get-token-price", token.address],
      enabled: !!token?.address,
    },
  );

  if (error) {
    throw error;
  }

  return status === "success" ? data : undefined;
};

export { useTokenPrice };
