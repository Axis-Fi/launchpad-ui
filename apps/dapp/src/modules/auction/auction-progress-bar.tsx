import { PropsWithAuction } from "@repo/types";
import { Progress, Text } from "@repo/ui";
import { calculateAuctionProgress } from "./utils/get-auction-progress";
import { ToggledUsdAmount } from "./toggled-usd-amount";
import { shorten } from "utils/number";

/** Renders a progress bar with the amount of tokens commited in bids*/
export default function AuctionProgressBar({ auction }: PropsWithAuction) {
  const { current, minTarget } = calculateAuctionProgress(auction);
  const bidAmount = auction.bids.reduce((total, b) => {
    total += Number(b.amountIn);
    return total;
  }, 0);

  return (
    <Progress value={current} minTarget={minTarget} className="mt-1">
      <div>
        <Text
          size="xs"
          mono
          uppercase
          color="secondary"
          className="leading-0 p-0"
        >
          Bids
        </Text>
        <Text mono className="leading-0 -mt-1">
          <ToggledUsdAmount
            token={auction.quoteToken}
            amount={bidAmount}
            untoggledFormat={shorten}
          />
        </Text>
      </div>
    </Progress>
  );
}
