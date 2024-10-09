import { useEffect, useState } from "react";
import type { PropsWithAuction } from "@repo/types";
import { Badge, Metric } from "@repo/ui";
import { getCountdown } from "utils";
import { useMediaQueries } from "loaders/use-media-queries";
import { formatDate } from "utils";

export function Countdown({ auction }: PropsWithAuction) {
  const { isTabletOrMobile } = useMediaQueries();
  const [timeRemaining, setTimeRemaining] = useState<string | null>(null);
  const isRegistrationLaunch = auction.status === "registering";

  const startDate = isRegistrationLaunch
    ? new Date(Date.now())
    : new Date(Number(auction.start) * 1000);

  const endDate = isRegistrationLaunch
    ? auction.registrationDeadline!
    : new Date(Number(auction.conclusion) * 1000);

  const now = new Date();

  const isOngoing = startDate <= now && endDate > now;

  const hasntStarted = startDate > now;

  const isFinished =
    now > endDate ||
    auction.status === "concluded" ||
    auction.status === "settled" ||
    auction.status === "decrypted";

  const inProgress = hasntStarted || isOngoing;

  const targetDate =
    hasntStarted && !isRegistrationLaunch ? startDate : endDate;

  // Immediately set the countdown if the auction is ongoing
  useEffect(() => {
    if (inProgress) {
      setTimeRemaining(getCountdown(targetDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refresh the countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (inProgress) {
        setTimeRemaining(getCountdown(targetDate));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startDate, endDate, isOngoing]);

  if (!inProgress && !isFinished) return null;

  return (
    <Badge size={isTabletOrMobile ? "s" : "xl"} className="px-4">
      <Metric
        size={isTabletOrMobile ? "s" : "m"}
        className="text-center"
        isLabelSpaced
        label={
          isFinished ? "Ended on " : hasntStarted ? "Upcoming in" : "Remaining"
        }
      >
        {isFinished
          ? formatDate.day(new Date(+auction.conclusion * 1000))
          : timeRemaining}
      </Metric>
    </Badge>
  );
}
