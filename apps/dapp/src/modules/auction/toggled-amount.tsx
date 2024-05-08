import { useToggle } from "@repo/ui";
import { abbreviateNumber } from "utils/currency";
import { formatUsdValue, useUsdValue } from "./hooks/use-usd-value";

type ToggledAmountProps = {
  symbol: string;
  amount: number | string;
  chainId: number;
};

const ToggledAmount = ({ symbol, amount, chainId }: ToggledAmountProps) => {
  const { getUsdValue } = useUsdValue(symbol, chainId);
  const { isToggled: isUsdToggled } = useToggle();

  if (amount === undefined) return undefined;

  let formattedAmount: string | undefined = `${abbreviateNumber(
    Number(amount),
  )} ${symbol}`;

  if (isUsdToggled) {
    const usdValue = getUsdValue(Number(amount));

    formattedAmount =
      usdValue !== undefined ? formatUsdValue(usdValue) : formattedAmount;
  }

  return formattedAmount;
};

export { ToggledAmount, type ToggledAmountProps };
