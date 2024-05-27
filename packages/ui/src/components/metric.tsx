import { cn } from "..";
import { Text } from "./primitives";

export type MetricProps = React.HTMLProps<HTMLDivElement> & {
  label: string;
  small?: boolean;
};

export function Metric(props: MetricProps) {
  const size = props.small ? "default" : "2xl";
  return (
    <div>
      <Text
        uppercase
        spaced
        mono
        size="xs"
        color="secondary"
        className="leading-none"
      >
        {props.label}
      </Text>
      <Text size={size} className={cn(props.small && "leading-none")}>
        {props.children}
      </Text>
    </div>
  );
}
