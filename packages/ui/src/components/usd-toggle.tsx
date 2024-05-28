import { useToggle } from "../hooks";
import { Chip, ToggleGroup, ToggleGroupItem } from "./primitives";

const UsdToggle: React.FC<{ currencySymbol: string }> = ({
  currencySymbol,
}) => {
  const { isToggled, toggle } = useToggle();

  return (
    <ToggleGroup
      type="single"
      onValueChange={toggle}
      value={isToggled ? "USD" : currencySymbol}
    >
      <ToggleGroupItem value="USD" className="border-none p-0">
        <Chip variant={isToggled ? "active" : "default"}>USD</Chip>
      </ToggleGroupItem>
      <ToggleGroupItem value={currencySymbol} className="border-none p-0">
        <Chip variant={!isToggled ? "active" : "default"}>
          {currencySymbol}
        </Chip>
      </ToggleGroupItem>
    </ToggleGroup>
  );
};

export { UsdToggle };
