import type { ControllerRenderProps, FieldValues, Path } from "react-hook-form";
import { cn } from "..";
import { Input, Slider } from "./primitives";
import { useEffect } from "react";

type PercentageSliderProps<
  T extends FieldValues = FieldValues,
  K extends Path<T> = Path<T>,
> = {
  field: ControllerRenderProps<T, K>;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number[];
  className?: string;
  inputClassName?: string;
  sliderClassName?: string;
};

export function PercentageSlider<
  T extends FieldValues = FieldValues,
  K extends Path<T> = Path<T>,
>({
  field,
  defaultValue,
  min = 0,
  max = 100,
  ...props
}: PercentageSliderProps<T, K>) {
  useEffect(() => {
    // If you look at the console you'll see the creat-auction page
    // sends through values like [10], and then a string "10",
    // which breaks it as we take the first char of the string field.value[0]
    // and set the value to that, which is below the min.
    // Need to figure out why the form is doing that.
    console.log("xxx", field, field.value, field.value?.[0]);
  }, [field.value]);
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
        value={Array.isArray(field.value) ? field.value : [field.value]}
        onValueChange={(v) => {
          console.log("CHANGED", v);
          field.onChange(v);
        }}
      />
    </div>
  );
}
