import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { useFormContext } from "react-hook-form";

import { cn } from "@/utils";
import { BidForm } from "./auction-purchase";

type PriceSliderProps = {
  minAmountDisplay?: string;
  maxAmountDisplay?: string;
};

const PriceSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & PriceSliderProps
>(({ className, ...props }, ref) => {
  const [price, setPrice] = React.useState<string>();
  const [sliderValue, setSliderValue] = React.useState<number[]>();

  const { watch } = useFormContext<BidForm>();
  const [formPrice] = watch(["bidPrice", "baseTokenAmount"]);

  //Updates slider position and value when the price is typed in
  React.useEffect(() => {
    if (formPrice && formPrice !== price) {
      setPrice(formPrice);
      setSliderValue([+formPrice]);
    }
  }, [formPrice]);

  function handleChange(value: number[]) {
    const [price] = value;
    if (!props.min || price >= props.min) {
      setPrice(price.toString());
      setSliderValue(value);
    }
  }

  const fadeLeft = price && isBelowLowerBound(+price, props.min, props.max);
  const fadeRight = price && isAboveUpperBound(+price, props.min, props.max);

  return (
    <div
      className={cn(
        "price-slider-gradient z-10 flex h-4 justify-center",
        className,
      )}
    >
      <div className={"relative w-[70%] "}>
        <div
          className={cn(
            "text-background absolute transition-all",
            fadeLeft && "opacity-0",
          )}
        >
          <div className="relative -top-2 m-0 text-[20px] leading-normal">
            |
          </div>
          <div className="text-foreground relative  -left-0.5 -top-4">
            {props.minAmountDisplay}
          </div>
        </div>
        <SliderPrimitive.Root
          ref={ref}
          value={sliderValue}
          onValueChange={handleChange}
          className={cn(
            "relative flex w-full cursor-pointer touch-none select-none items-center ",
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-4 w-full grow overflow-hidden ">
            <SliderPrimitive.Range className="absolute h-full">
              {" "}
            </SliderPrimitive.Range>
          </SliderPrimitive.Track>

          <SliderPrimitive.Thumb
            asChild
            className="focus-visible:ring-ring bg-background block h-4 w-4 rounded-full shadow transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
          >
            <div className="w-1" />
          </SliderPrimitive.Thumb>
        </SliderPrimitive.Root>
      </div>
      <div
        className={cn(
          "text-background relative -left-1 transition-all",
          fadeRight && "opacity-0",
        )}
      >
        <div className="relative -top-2 m-0 text-[20px] leading-normal">|</div>
        <div className="text-foreground relative  -left-0.5 -top-4">
          {props.maxAmountDisplay}
        </div>
      </div>
    </div>
  );
});

const TOLERANCE = 0.04; //4%

function isBelowLowerBound(value?: number, min = 0, max = 0): boolean {
  if (!value) return false;
  const lowerThreshold = min + (max - min) * TOLERANCE;
  return value <= lowerThreshold;
}

function isAboveUpperBound(value?: number, min = 0, max = 0): boolean {
  if (!value) return false;
  const upperThreshold = max - (max - min) * TOLERANCE;
  return value >= upperThreshold;
}

PriceSlider.displayName = SliderPrimitive.Root.displayName;
export { PriceSlider };
