import { Button, Switch, Tooltip, cn } from "@repo/ui";
import { RequiresWalletConnection } from "components/requires-wallet-connection";

type RequiresApprovalProps = {
  approved?: boolean;
  disabled?: boolean;
  withPermit2Enabled?: boolean;
  onPermit2Change?: (active: boolean) => void;
  onApprove: () => void;
} & React.HTMLAttributes<HTMLDivElement>;

export function RequiresApproval({
  className,
  ...props
}: RequiresApprovalProps) {
  if (props.approved) return <>{props.children}</>;

  return (
    <RequiresWalletConnection className={className} {...props}>
      <div className={cn("flex items-center gap-x-2 border", className)}>
        <Button
          className="w-full"
          onClick={props.onApprove}
          disabled={props.disabled}
        >
          APPROVE
        </Button>
        {props.withPermit2Enabled && (
          <Tooltip content="Use Permit2 instead of an approval transaction">
            <div className="flex h-min w-min items-center justify-end gap-x-1">
              <p className="text-nowrap">Permit2</p>
              <Switch
                className="border-axis-light-mid border-[1px]"
                onCheckedChange={props.onPermit2Change}
              />
            </div>
          </Tooltip>
        )}
      </div>
    </RequiresWalletConnection>
  );
}
