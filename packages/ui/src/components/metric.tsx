import { cn } from "@/utils";
import { Text, type TextWeight } from "./primitives";

export type MetricProps = Omit<React.HTMLProps<HTMLDivElement>, "size"> & {
  label: string;
  size?: "s" | "m" | "l";
  metricWeight?: TextWeight;
  className?: string;
};

export function Metric({
  label,
  children,
  className,
  size = "m",
  metricWeight = "default",
}: MetricProps) {
  const metricSize = size === "l" ? "xl" : size === "m" ? "lg" : "sm";

  return (
    <div className={className}>
      <Text
        uppercase
        spaced
        mono
        size="sm"
        color="secondary"
        className="leading-none"
      >
        {label}
      </Text>
      <Text
        mono
        size={metricSize}
        weight={metricWeight}
        className={cn("leading-none", size === "l" && "mt-sm")}
      >
        {children}
      </Text>
    </div>
  );
}
