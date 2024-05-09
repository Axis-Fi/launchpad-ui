import { useToggle } from "@repo/ui";
import type { Token } from "@repo/types";
import { abbreviateNumber } from "utils/currency";
import { useGetUsdAmount } from "./use-get-usd-amount";

const useGetToggledUsdAmount = (
  token: Token | undefined,
  timestamp: number | undefined,
) => {
  if (token === undefined) throw new Error("token cannot be undefined");

  const { isToggled: isUsdToggled } = useToggle();
  const { getUsdAmount } = useGetUsdAmount(token, timestamp);

  const getToggledUsdAmount = (
    amount: number,
    showTokenSymbol: boolean = true,
  ): string => {
    const formattedAmount = `${abbreviateNumber(Number(amount))} ${
      showTokenSymbol ? token.symbol : ""
    }`;

    if (!isUsdToggled) {
      return formattedAmount;
    }

    const usdAmount = getUsdAmount(Number(amount));
    return usdAmount || formattedAmount;
  };

  return {
    getToggledUsdAmount,
  };
};

export { useGetToggledUsdAmount };
