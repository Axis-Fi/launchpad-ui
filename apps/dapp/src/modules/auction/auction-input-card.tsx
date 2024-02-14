import {
  Button,
  CardContent,
  CardFooter,
  CardHeader,
  CardRoot,
  cn,
} from "@repo/ui";
import { PropsWithAuction } from ".";
import { AuctionStatusChip } from "./auction-status-chip";
import { formatDistanceToNow } from "date-fns";
import { RequiresWalletConnection } from "components/requires-wallet-connection";
import { MutationDialog } from "modules/transactions/mutation-dialog";

type AuctionInputCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLButtonElement> & {
    submitText: string | React.ReactNode;
    disabled?: boolean;
    showTrigger?: boolean;
    TriggerElement: typeof MutationDialog;
  };

export function AuctionInputCard({
  auction,
  TriggerElement,
  ...props
}: AuctionInputCardProps) {
  const remainingTime = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  const isLive = auction.status === "live";

  return (
    <CardRoot className="bg-foreground text-secondary w-full">
      <CardHeader
        className={cn(
          "flex-row items-center justify-between pt-2",
          !isLive && "justify-end",
        )}
      >
        {isLive && (
          <div className="pt-4">
            <p>Ends In</p>
            <h1>{remainingTime}</h1>
          </div>
        )}
        <AuctionStatusChip status={auction.status} className="self-start" />
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter className="flex justify-center">
        <RequiresWalletConnection>
          {props.showTrigger ? (
            <TriggerElement onConfirm={props.onClick} />
          ) : (
            props.submitText &&
            props.onClick && (
              <Button
                className="w-full"
                disabled={props.disabled}
                onClick={props.onClick}
              >
                {props.submitText}
              </Button>
            )
          )}
        </RequiresWalletConnection>
      </CardFooter>
    </CardRoot>
  );
}
