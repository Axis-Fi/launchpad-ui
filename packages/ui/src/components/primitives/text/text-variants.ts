import { cva } from "class-variance-authority";

export const textVariants = cva("text-sans", {
  variants: {
    color: {
      primary: "text-text-primary",
      secondary: "text-text-secondary",
    },
    size: {
      default: "text-base",
      xs: "text-xs",
      sm: "text-sm",
      lg: "text-lg",
      "2xl": "text-2xl font-medium",
      "3xl": "text-3xl",
    },
    weight: {
      default: "font-regular",
      light: "font-light",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    color: "primary",
    size: "default",
    weight: "default",
  },
});
