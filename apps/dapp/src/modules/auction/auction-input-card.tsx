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

type AuctionInputCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLButtonElement> & {
    submitText: string | React.ReactNode;
    disabled?: boolean;
  };

export function AuctionInputCard({ auction, ...props }: AuctionInputCardProps) {
  const remainingTime = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  const isConcluded = auction.status === "concluded";
  const isCreated = auction.status === "created";

  return (
    <CardRoot className="bg-foreground text-secondary w-full">
      <CardHeader
        className={cn(
          "flex-row items-center justify-between pt-2",
          isConcluded && "justify-end",
        )}
      >
        {!isConcluded && !isCreated && (
          <div className="pt-4">
            <p>Ends In</p>
            <h1>{remainingTime}</h1>
          </div>
        )}
        <AuctionStatusChip status={auction.status} className="self-start" />
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter>
        <RequiresWalletConnection>
          {props.submitText && props.onClick && (
            <Button
              className="w-full"
              disabled={props.disabled}
              onClick={props.onClick}
            >
              {props.submitText}
            </Button>
          )}
        </RequiresWalletConnection>
      </CardFooter>
    </CardRoot>
  );
}
