import { Button, Tooltip, cn } from "@repo/ui";
import { RefreshCwIcon } from "lucide-react";

type ReloadButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  refetching?: boolean;
  tooltip?: string;
};

export function ReloadButton({
  refetching,
  tooltip = "Reload page data",
  ...rest
}: ReloadButtonProps) {
  return (
    <Tooltip content={tooltip}>
      <Button {...rest} size="icon" variant="ghost">
        <RefreshCwIcon className={cn(refetching && "loading-indicator-fast")} />
      </Button>
    </Tooltip>
  );
}
