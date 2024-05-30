import * as React from "react";

import { cn } from "@/utils";
import { textVariants } from "./text";

const CardRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-surface text-foreground border-surface-outline rounded-lg border p-4",
      className,
    )}
    {...props}
  />
));
CardRoot.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("mb-4 flex items-center justify-between ", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      textVariants({ color: "secondary", size: "3xl", weight: "light" }),
      "font-mono leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-foreground-secondary text-sm", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

type CardProps = {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  headerRightElement?: React.ReactNode;
};

const Card = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & CardProps
>((props, ref) => {
  return (
    <CardRoot ref={ref} className={cn("transition-all", props.className)}>
      {(props.title || props.headerRightElement) && (
        <CardHeader>
          <CardTitle>{props.title}</CardTitle>
          {props.headerRightElement}
        </CardHeader>
      )}
      <CardContent className="h-full">{props.children}</CardContent>
    </CardRoot>
  );
});

Card.displayName = "Card";

export {
  Card,
  CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  type CardProps,
};
