import * as React from "react";

import { cn } from "@/utils";
import { type VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "focus-visible:ring-ring/20 bg-secondary flex w-full px-3 py-1 tracking-wide shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-foreground/50",
  {
    variants: {
      variant: {
        default: "h-9 text-sm rounded-full border-input",
        lg: "text-4xl text-foreground font-aeonfono font-light rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  tooltip?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

const IconnedInput = React.forwardRef<
  HTMLInputElement,
  InputProps & { icon: React.ReactNode }
>(({ className, icon, ...props }, ref) => {
  return (
    <div className="relative">
      <div className="absolute left-2 top-1.5">{icon}</div>
      <Input className={cn("pl-10", className)} {...props} ref={ref} />
    </div>
  );
});

IconnedInput.displayName = "IconnedInput";

export { Input, IconnedInput };
