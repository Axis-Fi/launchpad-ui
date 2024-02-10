import * as React from "react";

import { cn } from "@/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tooltip?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:ring-ring/20 bg-secondary flex h-9 w-full rounded-full px-3 py-1 text-sm tracking-wide shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-semibold focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
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
