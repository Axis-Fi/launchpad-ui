import { useToggle } from "@repo/ui";
import type { Token } from "@repo/types";
import { abbreviateNumber } from "utils/currency";
import { useGetUsdValue } from "./use-get-usd-value";
import { formatUsdValue } from "../utils/format-usd-value";

type ToggleUsdValueProps = {
  token: Token;
  amount: number;
};

const useToggleUsdValue = ({ token, amount }: ToggleUsdValueProps) => {
  const { isToggled: isUsdToggled } = useToggle();
  const { getUsdValue } = useGetUsdValue(token);

  if (amount === undefined) return undefined;

  let formattedAmount: string | undefined = `${abbreviateNumber(
    Number(amount),
  )} ${token.symbol}`;

  if (isUsdToggled) {
    const usdValue = getUsdValue(Number(amount));

    if (usdValue !== undefined) {
      formattedAmount = formatUsdValue(usdValue);
    }
  }

  return formattedAmount;
};

export { useToggleUsdValue };
