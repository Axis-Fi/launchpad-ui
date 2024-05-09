import { useToggle } from "@repo/ui";
import type { Token } from "@repo/types";
import { abbreviateNumber } from "utils/currency";
import { useGetUsdAmount } from "./use-get-usd-amount";

type ToggleUsdAmountProps = {
  token: Token;
  amount: number;
};

const useToggleUsdAmount = ({ token, amount }: ToggleUsdAmountProps) => {
  const { isToggled: isUsdToggled } = useToggle();
  const { getUsdAmount } = useGetUsdAmount(token);

  if (amount === undefined) return undefined;

  const formattedAmount = `${abbreviateNumber(Number(amount))} ${token.symbol}`;

  if (!isUsdToggled) {
    return formattedAmount;
  }

  const usdAmount = getUsdAmount(Number(amount));
  return usdAmount || formattedAmount;
};

export { useToggleUsdAmount };
