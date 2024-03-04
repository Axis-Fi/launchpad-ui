import { Button, cn } from "@repo/ui";
import { RefreshCwIcon } from "lucide-react";

type ReloadButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  refetching?: boolean;
};

export function ReloadButton(props: ReloadButtonProps) {
  return (
    <Button {...props} size="icon" variant="ghost">
      <RefreshCwIcon
        className={cn(props.refetching && "loading-indicator-fast")}
      />
    </Button>
  );
}
