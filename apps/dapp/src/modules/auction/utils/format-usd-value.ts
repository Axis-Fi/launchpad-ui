import { abbreviateNumber } from "utils/currency";

const formatUsdValue = (amount: number | undefined) => {
  return amount !== undefined ? `$${abbreviateNumber(amount)}` : undefined;
};

export { formatUsdValue };
