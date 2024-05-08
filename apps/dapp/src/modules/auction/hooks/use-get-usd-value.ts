import type { Token } from "@repo/types";
import { useTokenPrice } from "./use-token-price";

const useGetUsdValue = (token: Token | undefined) => {
  if (token === undefined) throw new Error("token cannot be undefined");

  const price = useTokenPrice(token);

  const getUsdValue = (amount: number) => {
    if (price === undefined || amount === undefined) {
      return undefined;
    }
    return Number(price) * Number(amount);
  };

  return { getUsdValue };
};

export { useGetUsdValue };
