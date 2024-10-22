import { PropsWithAuction } from "@repo/types";
import { Progress, Text, cn } from "@repo/ui";
import { calculateAuctionProgress } from "./utils/get-auction-progress";
import { ToggledUsdAmount } from "./toggled-usd-amount";
import { trimCurrency } from "utils/currency";

/** Renders a progress bar with the amount of tokens commited in bids*/
export default function AuctionProgressBar({ auction }: PropsWithAuction) {
  const { current, minTarget, targetAmount } =
    calculateAuctionProgress(auction);

  const bidAmount = auction.bids.reduce((total, b) => {
    total += Number(b.amountIn);
    return total;
  }, 0);

  const showCurrentProgress = auction.status !== "created" && bidAmount > 0;

  return (
    <Progress
      hideMinTarget
      value={current}
      minTarget={minTarget}
      className="mt-1 flex h-[64px] w-[400px] items-center lg:w-[900px]"
    >
      <div
        className={cn(
          "flex w-[400px] justify-between lg:w-[900px] ",
          !showCurrentProgress && "justify-end",
        )}
      >
        {showCurrentProgress && (
          <ProgressMetric auction={auction} label="Raised" value={bidAmount} />
        )}
        <ProgressMetric
          auction={auction}
          label="Target"
          value={targetAmount}
          className="text-right"
        />
      </div>
    </Progress>
  );
}

type ProgressMetricProps = {
  label: string;
  value: number;
  className?: string;
} & PropsWithAuction;

function ProgressMetric(props: ProgressMetricProps) {
  return (
    <div className={cn("flex flex-col gap-y-0.5 px-2.5", props.className)}>
      <Text mono className="-mt-1 font-bold leading-none lg:text-lg ">
        <ToggledUsdAmount
          token={props.auction.quoteToken}
          amount={props.value}
          untoggledFormat={(val) =>
            trimCurrency(val) + " " + props.auction.quoteToken.symbol
          }
        />
      </Text>

      <Text mono uppercase className="text-foreground p-0 leading-none">
        {props.label}
      </Text>
    </div>
  );
}
