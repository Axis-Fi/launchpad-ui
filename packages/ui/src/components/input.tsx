import { BasicInput, InputProps } from "./basic-input";
import { Label } from "./label";

export function Input(props: InputProps & { label?: string }) {
  if (!props.label) {
    return <BasicInput {...props} />;
  }

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={props.id}>{props.label}</Label>
      <BasicInput {...props} />
    </div>
  );
}
