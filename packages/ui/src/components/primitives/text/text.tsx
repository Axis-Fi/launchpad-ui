import { VariantProps } from "class-variance-authority";
import { textVariants } from "./text-variants";
import React from "react";
import { cn } from "@/utils";

const sizeMap = {
  xl: "h4",
  "2xl": "h2",
  sm: "p",
  default: "p",
};

export interface TextProps
  extends Omit<React.HTMLProps<HTMLParagraphElement>, "color" | "size">,
    VariantProps<typeof textVariants> {
  mono?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, color, size, weight, ...props }, ref) => {
    const Element = (size ? sizeMap[size] : sizeMap.default) as "div";

    return (
      <Element
        className={cn(
          textVariants({ color, size, weight, className }),
          props.mono && "font-mono",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";
export { Text };
