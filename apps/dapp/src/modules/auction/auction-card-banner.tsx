import { Chain } from "@repo/types";
import { Badge } from "@repo/ui";
import { isBefore } from "date-fns";
import { getCountdown } from "utils/date";

type AuctionCardBannerProps = {
  chain: Chain;
  deadline: Date;
  image?: string;
  curator?: {
    name: string;
    address: string;
    avatar: string;
  };
};

export function AuctionCardBanner(props: AuctionCardBannerProps) {
  const isOngoing = isBefore(Date.now(), props.deadline);
  const countdown = isOngoing && getCountdown(props.deadline);

  return (
    <div
      className="flex h-[330px] w-[580px] flex-col justify-between bg-cover p-4"
      style={{ backgroundImage: `url(${props.image})` }}
    >
      <div className="flex justify-between">
        <Badge icon={props.chain?.iconUrl as string}>{props.chain.name}</Badge>
      </div>

      <div className="flex items-end justify-between">
        {props.curator && (
          <Badge icon={props.curator?.avatar as string} className="normal-case">
            {props.curator.name}
          </Badge>
        )}

        <div>
          {isOngoing && (
            <Badge size="lg">
              <div className="text-center">
                <p className="uppercase">Remaining</p>
                <p className="text-2xl">{countdown}</p>
              </div>
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
