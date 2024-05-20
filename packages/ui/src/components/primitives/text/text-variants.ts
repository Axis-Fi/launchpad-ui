import { cva } from "class-variance-authority";

export const textVariants = cva("text-sans", {
  variants: {
    color: {
      primary: "text-text-primary",
      secondary: "text-text-secondary",
    },
    size: {
      default: "text-base",
      sm: "text-sm",
      xl: "text-3xl",
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
