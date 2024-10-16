import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/utils";

type ProgressProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & { minTarget?: number };

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, ...props }, ref) => {
  //If low percentage render the children outside the indicator to remain visible
  const currentPercentage = value ?? 0;
  const isLowPercentage = currentPercentage < 10;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "bg-primary-500 relative h-10 w-full overflow-hidden",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="bg-surface-progress absolute flex h-full w-full items-center justify-end transition-all"
        style={{ width: `${currentPercentage}%` }}
      >
        {!isLowPercentage && (
          <span className="text-foreground pr-2">{props.children}</span>
        )}
      </ProgressPrimitive.Indicator>

      {isLowPercentage && (
        <span
          className="text-foreground absolute left-4 mt-0.5 pr-2"
          style={{ left: `${currentPercentage}%` }}
        >
          {props.children}
        </span>
      )}

      {props.minTarget != null && (
        <div
          className="absolute h-full w-1 border-l-[2px] border-dashed"
          style={{ left: `${props.minTarget}%` }}
        />
      )}
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
