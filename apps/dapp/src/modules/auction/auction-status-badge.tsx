import { Badge, cn } from "@repo/ui";
import { AuctionStatus } from "@repo/types";

/** Displays a indicator with the auction's current status */
export function AuctionStatusBadge({
  status,
  className,
  large = false,
}: {
  status: AuctionStatus;
  large?: boolean;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <Badge
      size={status === "live" && large ? "xl" : "m"}
      className={cn(className, "dark:text-black")}
      color={status === "live" || status === "registering" ? "active" : "ghost"}
    >
      {status}
    </Badge>
  );
}
