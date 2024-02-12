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

type AuctionInputCardProps = PropsWithAuction &
  React.HTMLAttributes<HTMLButtonElement> & {
    submitText: string | React.ReactNode;
  };

export function AuctionInputCard({ auction, ...props }: AuctionInputCardProps) {
  const remainingTime = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  const isConcluded = auction.status === "concluded";

  return (
    <CardRoot className="bg-foreground text-secondary w-full">
      <CardHeader
        className={cn(
          "flex-row items-center justify-between pt-2",
          isConcluded && "justify-end",
        )}
      >
        {!isConcluded && (
          <div className="pt-4">
            <h1>{remainingTime}</h1>
            <p>Ends In</p>
          </div>
        )}
        <AuctionStatusChip status={auction.status} className="self-start" />
      </CardHeader>
      <CardContent>{props.children}</CardContent>
      <CardFooter>
        {/*TODO: improve this*/}
        {props.submitText && props.onClick && (
          <Button className="w-full" onClick={props.onClick}>
            {props.submitText}
          </Button>
        )}
      </CardFooter>
    </CardRoot>
  );
}
