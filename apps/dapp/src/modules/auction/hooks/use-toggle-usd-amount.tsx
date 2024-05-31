import { useToggle } from "@repo/ui";
import type { Token } from "@repo/types";
import { shorten } from "utils/number";
import { useGetUsdAmount } from "./use-get-usd-amount";

type ToggleUsdAmountProps = {
  token: Token;
  amount: number;
  timestamp?: number | undefined;
};

const useToggleUsdAmount = ({
  token,
  amount,
  timestamp,
}: ToggleUsdAmountProps) => {
  const { isToggled: isUsdToggled } = useToggle();
  const { getUsdAmount } = useGetUsdAmount(token, timestamp);

  if (amount === undefined) return undefined;

  const formattedAmount = `${shorten(Number(amount))} ${token.symbol}`;

  if (!isUsdToggled) {
    return formattedAmount;
  }

  const usdAmount = getUsdAmount(Number(amount));
  return usdAmount || formattedAmount;
};

export { useToggleUsdAmount };
