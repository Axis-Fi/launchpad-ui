import { cn } from "..";

export function InfoLabel(
  props: {
    label: string;
    value: React.ReactNode;
  } & React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div className="min-w-40">
      <p className={cn("text-2xl", props.className)}>{props.value}</p>
      <p>{props.label}</p>
    </div>
  );
}
