import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";
import { Avatar } from "./avatar";

const badgeVariants = cva(
  "inline-flex h-min items-center justify-center rounded-full border uppercase transition-colors border-0",
  {
    variants: {
      color: {
        active: "bg-feedback-success",
        alert: "bg-feedback-success text-neutral-50",
        ghost: "bg-app",
      },
      size: {
        s: "p-2 h-xl text-sm",
        m: "p-2 text-md",
        xl: "p-2 text-lg",
        round: "rounded-full w-fit px-1 py-0",
      },
    },
    defaultVariants: {
      size: "m",
      color: "active",
    },
  },
);

type BadgeProps = Omit<React.HTMLAttributes<HTMLDivElement>, "color" | "size"> &
  VariantProps<typeof badgeVariants> & {
    icon?: string;
  };

function Badge({ className, color, size, children, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        badgeVariants({ color, size }),
        className,
        props.icon && "pr-2",
      )}
      {...props}
    >
      {props.icon && <Avatar className="mr-1 size-6" src={props.icon} />}
      {children}
    </div>
  );
}

export { Badge };
