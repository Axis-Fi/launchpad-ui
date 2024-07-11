import { ControllerRenderProps } from "react-hook-form";
import { cn } from "..";
import { Input, Slider } from "./primitives";

type PercentageSliderProps = {
  field: ControllerRenderProps; //TODO: add support for generic type
  defaultValue?: number;
  min?: number;
  max?: number;
  className?: string;
  inputClassName?: string;
  sliderClassName?: string;
};

export function PercentageSlider({
  field,
  defaultValue,
  min = 0,
  max = 100,
  ...props
}: PercentageSliderProps) {
  return (
    <div className={cn("flex items-center", props.className)}>
      <Input
        disabled
        className={cn("w-16 disabled:opacity-100", props.inputClassName)}
        value={`${field.value?.[0] ?? defaultValue}%`}
      />
      <Slider
        {...field}
        className={cn("cursor-pointer", props.sliderClassName)}
        min={min}
        max={max}
        defaultValue={[defaultValue ?? 0]}
        value={field.value}
        onValueChange={(v) => field.onChange(v)}
      />
    </div>
  );
}
