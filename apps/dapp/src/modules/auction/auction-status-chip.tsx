import { Badge, cn } from "@repo/ui";
import { AuctionStatus } from "src/types";

/** Displays a indicator with the auction's current status */
export function AuctionStatusChip({
  status,
  className,
}: { status: AuctionStatus } & React.HTMLAttributes<HTMLParagraphElement>) {
  const statusColor =
    status === "concluded"
      ? "bg-axis-dark-mid text-foreground"
      : "bg-axis-green";

  return (
    <Badge
      className={cn(
        "text-background rounded-full font-medium uppercase",
        statusColor,
        className,
      )}
    >
      {status}
    </Badge>
  );
}
