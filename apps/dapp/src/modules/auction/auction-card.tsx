import { Avatar, Button, Progress, Skeleton } from "@repo/ui";
import { SocialRow } from "components/social-row";
import { formatDistanceToNow } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { Auction } from "src/types";
import { AuctionStatusChip } from "./auction-status-chip";
import { PropsWithAuction } from ".";

type AuctionCardProps = {
  onClickView?: (auction: Auction) => void;
} & React.HTMLAttributes<HTMLDivElement> &
  PropsWithAuction;

export function AuctionCard({
  auction,
  onClickView,
  ...props
}: AuctionCardProps) {
  const progress = calculatePercentage(
    auction.start,
    auction.conclusion,
    new Date().getTime() / 1000,
  );

  const remainingTime = formatDistanceToNow(
    new Date(Number(auction.conclusion) * 1000),
  );

  return (
    <div
      className="bg-secondary w-full max-w-[400px] rounded-sm p-2"
      {...props}
    >
      <div className="flex justify-between">
        <AuctionStatusChip status={auction.status} />
        <SocialRow {...(auction.auctionInfo?.links ?? {})} className="h-6" />
      </div>

      <div className="bg-axis-orange-grad mt-2 flex flex-col rounded-md pt-6 ">
        <div className="flex items-center gap-x-1 px-4">
          <Avatar
            className="text-md h-12 w-12"
            src={auction.auctionInfo?.links?.payoutTokenLogo}
            alt={auction.baseToken.symbol}
          />
          <p>{auction.baseToken.name}</p>
        </div>
        <Progress
          className="auction-progress relative mt-4 w-[100%] self-end"
          value={progress > 100 ? 100 : progress}
        />
      </div>
      <div className="font-aeonfono mt-2 text-center ">
        {auction.status === "concluded" ? (
          <h4>Auction has ended</h4>
        ) : (
          <>
            <h4 className="leading-none">{remainingTime}</h4>
            <p className="leading-none">Remaining</p>
          </>
        )}
        <p className="mt-4 text-left leading-5">
          {auction.auctionInfo?.description}
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <Button
          onClick={() => onClickView?.(auction)}
          variant="outline"
          className="mx-auto"
        >
          View Auction <ArrowRightIcon className="w-5" />
        </Button>
      </div>
    </div>
  );
}

function calculatePercentage(
  start: string | number,
  end: string | number,
  current: string | number,
) {
  return (
    ((Number(current) - Number(start)) / (Number(end) - Number(start))) * 100
  );
}

export function AuctionCardLoading() {
  return (
    <div className="bg-secondary h-[220px] max-w-[390px] rounded-sm p-2">
      <div className="flex justify-between">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-6 w-32 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-20 w-full" />
      <div className="flex flex-col items-center justify-around">
        <Skeleton className="mt-4 h-14 w-full" />
      </div>
    </div>
  );
}
