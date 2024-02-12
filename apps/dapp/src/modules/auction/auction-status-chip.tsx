import { cn } from "@repo/ui";
import { AuctionStatus } from "src/types";

/** Displays a indicator with the auction's current status */
export function AuctionStatusChip({
  status,
  className,
}: { status: AuctionStatus } & React.HTMLAttributes<HTMLParagraphElement>) {
  const statusColor =
    status === "concluded" ? "bg-axis-dark-mid" : "bg-axis-green";
  return (
    <p
      className={cn(
        "text-background rounded-full px-2 py-0.5 text-sm uppercase",
        statusColor,
        className,
      )}
    >
      {status}
    </p>
  );
}
