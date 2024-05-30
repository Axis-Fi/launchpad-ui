import { Text, type TextSize, type TextWeight } from "./primitives";

export type MetricProps = React.HTMLProps<HTMLDivElement> & {
  label: string;
  metricSize?: TextSize;
  metricWeight?: TextWeight;
  className?: string;
};

export function Metric({
  label,
  children,
  className,
  metricSize = "lg",
  metricWeight = "default",
}: MetricProps) {
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
        className="leading-none"
      >
        {children}
      </Text>
    </div>
  );
}
