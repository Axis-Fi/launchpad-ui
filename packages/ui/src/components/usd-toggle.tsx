import { useToggle } from "../hooks";
import { ToggleGroup, ToggleGroupItem } from "./primitives";

const UsdToggle: React.FC<{ currencySymbol: string }> = ({
  currencySymbol,
}) => {
  const { isToggled, toggle } = useToggle();

  return (
    <ToggleGroup
      className="focus-visible:ring-ring flex items-center justify-center gap-1 whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
      type="single"
      onValueChange={toggle}
      value={isToggled ? "USD" : currencySymbol}
    >
      <ToggleGroupItem value="USD">USD</ToggleGroupItem>
      <ToggleGroupItem value={currencySymbol}>{currencySymbol}</ToggleGroupItem>
    </ToggleGroup>
  );
};

export { UsdToggle };
