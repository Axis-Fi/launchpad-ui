import { Chain } from "@repo/types";
import { Badge, cn } from "@repo/ui";
import { isBefore } from "date-fns";
import { getCountdown } from "utils/date";

type AuctionCardBannerProps = {
  chain: Chain;
  deadline?: Date;
  image?: string;
  curator?: {
    name: string;
    address: string;
    avatar: string;
  };
  isGrid?: boolean;
};

export function AuctionCardBanner(props: AuctionCardBannerProps) {
  const isOngoing = props.deadline && isBefore(Date.now(), props.deadline);
  const countdown = props.deadline && isOngoing && getCountdown(props.deadline);

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-sm bg-cover p-4 transition-all",
        props.isGrid
          ? "mb-2 h-[192px] w-full p-2 group-hover:h-[64px]"
          : "h-[330px] w-[580px]",
      )}
      style={{ backgroundImage: `url(${props.image})` }}
    >
      <div className="flex justify-between">
        <Badge icon={props.chain?.iconUrl as string}>{props.chain.name}</Badge>
      </div>

      <div
        className={cn(
          "flex items-end justify-between",
          !props.curator && "justify-end",
        )}
      >
        {props.curator && (
          <Badge icon={props.curator?.avatar as string} className="normal-case">
            {props.curator.name}
          </Badge>
        )}

        <div>
          {isOngoing && (
            <Badge size="xl">
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
