import { abbreviateNumber } from "utils/currency";
import { useTokenPrice } from "./use-token-price";

// TODO: move to utils
const formatUsdValue = (amount: number | undefined) => {
  return amount !== undefined ? `$${abbreviateNumber(amount)}` : undefined;
};

const useUsdValue = (
  symbol: string | undefined,
  chainId: number | undefined,
) => {
  // TODO can this trigger via race condition?
  if (symbol === undefined) throw new Error("symbol cannot be undefined");
  if (chainId === undefined) throw new Error("chainId cannot be undefined");

  const price = useTokenPrice(chainId, symbol);

  const getUsdValue = (amount: number) => {
    return price !== undefined && amount !== undefined
      ? Number(price) * Number(amount)
      : undefined;
  };

  return { getUsdValue };
};

export { formatUsdValue, useUsdValue };
