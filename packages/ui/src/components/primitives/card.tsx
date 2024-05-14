import * as React from "react";

import { cn } from "@/utils";

const CardRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground border-card rounded-md border shadow",
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
    className={cn("flex flex-col space-y-1.5 p-6", className)}
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
    className={cn("font-semibold leading-none tracking-tight", className)}
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
    className={cn("text-muted-foreground text-sm", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

type CardProps = {
  title?: React.ReactNode;
  description?: string;
  footer?: React.ReactNode;
};
export function Card(
  props: Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & CardProps,
) {
  return (
    <CardRoot className={cn("min-w-[300px]", props.className)}>
      <CardHeader>
        {props.title && <CardTitle>{props.title}</CardTitle>}
        {props.description && (
          <CardDescription>{props.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      {props.footer && <CardFooter>{props.footer}</CardFooter>}
    </CardRoot>
  );
}

export {
  CardRoot,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
