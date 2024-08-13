import { useToggle } from "@repo/ui";
import { UsdAmount, type UsdAmountProps } from "./usd-amount";

type ToggledUsdAmountProps = UsdAmountProps & {
  untoggledFormat?: (amount: number) => string;
};

function ToggledUsdAmount({
  token,
  amount,
  timestamp,
  untoggledFormat,
}: ToggledUsdAmountProps) {
  const { isToggled: isUsdToggled } = useToggle();

  if (isUsdToggled) {
    return <UsdAmount token={token} amount={amount} timestamp={timestamp} />;
  }

  return <>{untoggledFormat ? untoggledFormat(amount) : amount}</>;
}

export { ToggledUsdAmount };
