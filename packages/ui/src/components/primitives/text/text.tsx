import { VariantProps } from "class-variance-authority";
import { textVariants } from "./text-variants";
import React from "react";
import { cn } from "@/utils";

const sizeMap = {
  "7xl": "h1",
  "3xl": "h3",
  "2xl": "h3",
  xl: "h3",
  lg: "h4",
  xs: "p",
  sm: "p",
  default: "p",
};

export interface TextProps
  extends Omit<React.HTMLProps<HTMLParagraphElement>, "color" | "size">,
    VariantProps<typeof textVariants> {
  mono?: boolean;
  uppercase?: boolean;
  spaced?: boolean;
}

const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  (
    { className, color, size, weight, mono, uppercase, spaced, ...props },
    ref,
  ) => {
    const Element = (size ? sizeMap[size] : sizeMap.default) as "div";

    return (
      <Element
        className={cn(
          textVariants({ color, size, weight, className }),
          mono && "font-mono",
          uppercase && "uppercase",
          spaced && "tracking-[1.2px]",
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Text.displayName = "Text";
export { Text };
