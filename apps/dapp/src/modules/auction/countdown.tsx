import { useEffect, useState } from "react";
import type { PropsWithAuction } from "@repo/types";
import { Badge, Metric } from "@repo/ui";
import { getCountdown } from "utils";

export function Countdown({ auction }: PropsWithAuction) {
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);

  const isOngoing =
    auction.formatted &&
    auction.formatted.startDate < new Date() &&
    auction.formatted.endDate > new Date();

  // Immediately set the countdown if the auction is ongoing
  useEffect(() => {
    if (isOngoing && auction.formatted?.endDate) {
      setTimeRemaining(getCountdown(auction.formatted?.endDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh the countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (isOngoing && auction?.formatted?.endDate) {
        setTimeRemaining(getCountdown(auction?.formatted?.endDate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [auction?.formatted?.endDate, isOngoing]);

  if (!isOngoing) return null;

  return (
    <Badge size="xl" className="px-4">
      <Metric className="text-center" isLabelSpaced label="Remaining">
        {timeRemaining}
      </Metric>
    </Badge>
  );
}
