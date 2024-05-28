import { Text, type Size, type Weight } from "./primitives";

export type MetricProps = React.HTMLProps<HTMLDivElement> & {
  label: string;
  metricSize?: Size;
  metricWeight?: Weight;
  className?: string;
};

export function Metric({
  label,
  children,
  className,
  metricSize = "2xl",
  metricWeight = "default",
}: MetricProps) {
  return (
    <div className={className}>
      <Text
        uppercase
        spaced
        mono
        size="xs"
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
