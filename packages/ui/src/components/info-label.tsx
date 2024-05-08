import { Input, cn } from "..";

export type InfoLabelProps = {
  label: React.ReactNode;
  value: React.ReactNode;
  reverse?: boolean;
  editable?: boolean;
  inputClassName?: string;
} & React.ComponentProps<"input">;

export function InfoLabel(props: InfoLabelProps) {
  return (
    <div className={cn(props.reverse && "flex flex-col-reverse")}>
      {props.editable ? (
        <Input
          variant="ghost"
          textSize="lg"
          className={props.inputClassName}
          onChange={props.onChange}
          onBlur={props.onBlur}
          value={props.value as string}
        />
      ) : (
        <p className={cn("text-2xl", props.className)}>{props.value}</p>
      )}
      <p className="text-sm">{props.label}</p>
    </div>
  );
}
