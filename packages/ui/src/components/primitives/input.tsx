import * as React from "react";

import { cn } from "@/utils";

import { LabelWrapper } from "./label";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tooltip?: React.ReactNode;
}

export function Input({ label, ...props }: InputProps) {
  if (!label) {
    return <InputPrimitive {...props} />;
  }

  return (
    <LabelWrapper htmlFor={props.id} content={label}>
      <InputPrimitive {...props} />
    </LabelWrapper>
  );
}

const InputPrimitive = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
InputPrimitive.displayName = "BasicInput";

export { InputPrimitive };
