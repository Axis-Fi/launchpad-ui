import type { Token } from "@repo/types";
import { useTokenPrice } from "./use-token-price";
import { formatUsdValue } from "../utils/format-usd-amount";

const useGetUsdAmount = (token: Token | undefined) => {
  if (token === undefined) throw new Error("token cannot be undefined");

  const price = useTokenPrice(token);

  const getUsdAmount = (amount: number) => {
    if (price === undefined || amount === undefined) {
      return undefined;
    }
    return formatUsdValue(Number(price) * Number(amount));
  };

  return { getUsdAmount };
};

export { useGetUsdAmount };
