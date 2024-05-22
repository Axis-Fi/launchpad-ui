import { Badge, cn } from "@repo/ui";
import { AuctionStatus } from "@repo/types";

/** Displays a indicator with the auction's current status */
export function AuctionStatusBadge({
  status,
  className,
  large,
}: {
  status: AuctionStatus;
  large?: boolean;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const statusColor =
    status === "concluded" ? "bg-destructive text-foreground" : "bg-primary";

  return (
    <Badge
      size={large ? "lg" : "default"}
      className={cn(statusColor, className)}
    >
      {status}
    </Badge>
  );
}
