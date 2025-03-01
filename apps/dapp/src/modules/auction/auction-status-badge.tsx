import { Badge, cn } from "@repo/ui";
import { AuctionStatus } from "@axis-finance/types";

/** Displays a indicator with the auction's current status */
export function AuctionStatusBadge({
  status,
  className,
  large = false,
}: {
  status: AuctionStatus;
  large?: boolean;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const isLive = status === "live";

  return (
    <Badge
      size={status === "live" && large ? "xl" : "m"}
      className={cn(
        className,
        isLive ? "dark:text-black" : "dark:text-neutral-500",
      )}
      color={isLive ? "active" : "ghost"}
    >
      {status}
    </Badge>
  );
}
