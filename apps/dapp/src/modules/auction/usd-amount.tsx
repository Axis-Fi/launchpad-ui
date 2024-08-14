import type { Token } from "@repo/types";
import { useUsdAmount } from "./hooks/use-usd-amount";

type UsdAmountProps = {
  token: Token;
  amount: number;
  timestamp?: number;
};

function UsdAmount({ token, amount, timestamp }: UsdAmountProps) {
  const usdPrice = useUsdAmount({ token, amount, timestamp });
  return usdPrice ? usdPrice : undefined;
}

export { UsdAmount };
export type { UsdAmountProps };
