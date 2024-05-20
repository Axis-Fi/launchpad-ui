import { Text } from "./primitives";

export type MetricProps = React.HTMLProps<HTMLDivElement> & {
  label: string;
};

export function Metric(props: MetricProps) {
  return (
    <div>
      <Text uppercase spaced mono size="xs" color="secondary">
        {props.label}
      </Text>
      <Text size="2xl">{props.children}</Text>
    </div>
  );
}
