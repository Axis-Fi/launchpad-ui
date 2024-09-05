import { cn } from "@/utils";
import { Text, type TextWeight } from "./primitives";
import { Tooltip } from "./tooltip";

export type MetricProps = Omit<React.HTMLProps<HTMLDivElement>, "size"> & {
  label: string;
  size?: "s" | "m" | "l" | "xl";
  metricWeight?: TextWeight;
  className?: string;
  tooltip?: string;
  isLabelSpaced?: boolean;
};

export function Metric({
  label,
  children,
  className,
  size = "m",
  metricWeight = "default",
  tooltip,
  isLabelSpaced = false,
}: MetricProps) {
  const metricSize =
    size === "xl" ? "2xl" : size === "l" ? "xl" : size === "m" ? "lg" : "md";

  return (
    <div className={className}>
      <Tooltip content={tooltip || null}>
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
      </Tooltip>
      <Text
        mono
        size={metricSize}
        weight={metricWeight}
        spaced={isLabelSpaced}
        className={cn("leading-none", size === "l" && "mt-sm")}
      >
        {children}
      </Text>
    </div>
  );
}
