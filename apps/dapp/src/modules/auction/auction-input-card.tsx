import {
  Button,
  CardContent,
  CardFooter,
  CardHeader,
  CardRoot,
  cn,
} from "@repo/ui";
import { PropsWithAuction } from "@repo/types";
import { AuctionStatusChip } from "./auction-status-chip";
import { TransactionDialog } from "modules/transaction/transaction-dialog";
import { RequiresChain } from "components/requires-chain";

type AuctionInputCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLButtonElement> & {
    submitText: string | React.ReactNode;
    disabled?: boolean;
    showTrigger?: boolean;
    TriggerElement?: typeof TransactionDialog;
  };

export function AuctionInputCard({
  auction,
  TriggerElement,
  ...props
}: AuctionInputCardProps) {
  const isLive = auction.status === "live";

  return (
    <CardRoot className="bg-foreground text-secondary w-full">
      <CardHeader
        className={cn(
          "flex-row items-center justify-end pt-2",
          !isLive && "justify-end",
        )}
      >
        <AuctionStatusChip status={auction.status} className="self-start" />
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter className="flex justify-center">
        {props.showTrigger && (
          <RequiresChain chainId={auction.chainId}>
            {TriggerElement ? (
              //@ts-expect-error //TODO: revamp
              <TriggerElement onConfirm={(e) => props.onClick?.(e)} />
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
          </RequiresChain>
        )}
      </CardFooter>
    </CardRoot>
  );
}
