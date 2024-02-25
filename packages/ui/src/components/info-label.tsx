import { Input, cn } from "..";

export function InfoLabel(
  props: {
    label: string;
    value: React.ReactNode;
    reverse?: boolean;
    editable?: boolean;
    inputClassName?: string;
  } & React.ComponentProps<"input">,
) {
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
      <p>{props.label}</p>
    </div>
  );
}
