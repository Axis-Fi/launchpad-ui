import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
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
        className="bg-surface-progress absolute flex h-full items-center justify-end transition-all"
        style={{ width: `${value}%` }}
      >
        <span className="pr-2 text-black">{props.children}</span>
      </ProgressPrimitive.Indicator>
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
