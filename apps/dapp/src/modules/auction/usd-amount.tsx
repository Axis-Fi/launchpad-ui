import type { Token } from "@repo/types";
import { useUsdAmount } from "./hooks/use-usd-amount";

type UsdAmountProps = {
  token: Token;
  amount: bigint;
  timestamp?: number;
};

function UsdAmount({ token, amount, timestamp }: UsdAmountProps) {
  const usdPrice = useUsdAmount({ token, amount, timestamp });
  return usdPrice ? usdPrice : undefined;
}

export { UsdAmount };
