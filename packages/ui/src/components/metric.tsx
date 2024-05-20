import { Text } from "./primitives";

export type MetricProps = React.HTMLProps<HTMLDivElement> & {
  label: string;
  small?: boolean;
};

export function Metric(props: MetricProps) {
  const size = props.small ? "default" : "2xl";
  return (
    <div>
      <Text uppercase spaced mono size="xs" color="secondary">
        {props.label}
      </Text>
      <Text size={size}>{props.children}</Text>
    </div>
  );
}
