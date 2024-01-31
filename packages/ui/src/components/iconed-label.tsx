import { Avatar } from "./primitives/avatar";

export function IconedLabel(
  props: React.PropsWithChildren<{ src?: string; label?: string }>,
) {
  return (
    <div className="flex items-center justify-start gap-x-2">
      <Avatar src={props.src} alt={props.label} />
      {props.label ?? props.children}
    </div>
  );
}
