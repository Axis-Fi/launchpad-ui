import { Button, Tooltip, cn } from "@repo/ui";
import { RefreshCwIcon } from "lucide-react";

type ReloadButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  refetching?: boolean;
  tooltip?: string;
};

export function ReloadButton(props: ReloadButtonProps) {
  const tooltip = props.tooltip ?? "Reload page data";
  return (
    <Tooltip content={tooltip}>
      <Button {...props} size="icon" variant="ghost">
        <RefreshCwIcon
          className={cn(props.refetching && "loading-indicator-fast")}
        />
      </Button>
    </Tooltip>
  );
}
