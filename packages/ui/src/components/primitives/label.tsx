import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";
import { InfoCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/utils";
import { Tooltip } from "../tooltip";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

type LabelProps = {
  tooltip?: React.ReactNode;
};

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants> &
    LabelProps
>(({ className, ...props }, ref) => {
  const label = (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        labelVariants(),
        props.tooltip && "cursor-pointer",
        className,
      )}
      {...props}
    />
  );

  return props.tooltip ? (
    <Tooltip content={props.tooltip}>
      <div className="flex gap-x-1">
        {label}
        <InfoCircledIcon />
      </div>
    </Tooltip>
  ) : (
    label
  );
});

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
