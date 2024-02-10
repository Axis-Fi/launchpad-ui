import { Avatar, Button, Progress } from "@repo/ui";
import { SocialRow, SocialURLs } from "components/social-row";
import { formatDistanceToNow } from "date-fns";
import { ArrowRightIcon } from "lucide-react";
import { Auction } from "src/types";

type AuctionCardProps = {
  auction: Auction;
  socials: SocialURLs;
} & React.ComponentPropsWithoutRef<"div">;

export function AuctionCard({ auction, socials, ...props }: AuctionCardProps) {
  const progress = calculatePercentage(
    auction.start,
    auction.conclusion,
    new Date().getTime() / 1000,
  );

  const remainingTime = formatDistanceToNow(new Date(1710105964 * 1000));

  return (
    <div className="bg-secondary w-full max-w-[400px] p-2" {...props}>
      <div className="flex justify-between">
        <p className="bg-axis-green text-background rounded-full px-2 py-0.5 text-sm uppercase">
          {auction.status}
        </p>
        <SocialRow {...socials} />
      </div>

      <div className="bg-axis-orange-grad mt-2 flex flex-col rounded-md pt-6 ">
        <div className="flex items-center gap-x-1 px-4">
          <Avatar
            className="text-md h-12 w-12"
            src={auction.baseToken.logoURL}
            alt={auction.baseToken.symbol}
          />
          <p>{auction.baseToken.name}</p>
        </div>
        <Progress
          className="auction-progress mt-4 self-end"
          value={progress > 100 ? 100 : progress}
        />
      </div>
      <div className="font-aeonfono mt-2 text-center ">
        <h4 className="leading-none">{remainingTime}</h4>
        <p className="leading-none">Remaining</p>
        <p className="mt-4 text-left leading-5">{auction.description}</p>
      </div>

      <div className="mt-4 flex justify-center">
        <Button variant="outline" className="mx-auto">
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
