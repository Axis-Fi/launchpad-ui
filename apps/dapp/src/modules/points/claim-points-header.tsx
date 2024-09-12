import type React from "react";
import { Text, cn } from "@repo/ui";

export function PointsHeader({
  title = "Axis Points",
  subtitle = "Points Claim",
  subtitleClassName,
}: {
  title?: string;
  subtitle?: React.ReactNode;
  subtitleClassName?: string;
}) {
  return (
    <div className="text-right">
      <Text
        size="sm"
        mono
        uppercase
        className="text-foreground-tertiary tracking-widest"
      >
        {title}
      </Text>
      <Text
        className={cn(
          "ml-auto mt-1 w-2/3 font-light leading-none tracking-wide",
          subtitleClassName,
        )}
        size="xl"
        mono
      >
        {subtitle}
      </Text>
    </div>
  );
}
