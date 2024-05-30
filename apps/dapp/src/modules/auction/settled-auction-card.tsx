import {
  Card,
  cn,
  Metric,
  ToggleProvider,
  type TextSize,
  type TextWeight,
} from "@repo/ui";
import type { Token, PropsWithAuction, BatchAuction } from "@repo/types";
import { SettledAuctionChart } from "./settled-auction-chart";
import { useToggleUsdAmount } from "./hooks/use-toggle-usd-amount";
import { getTimestamp } from "utils/date";

type ToggledAmountProps = {
  label: string;
  token: Token;
  amount: number;
  timestamp?: number;
  size?: TextSize;
  weight?: TextWeight;
  className?: string;
};

const ToggledAmount = ({
  label,
  token,
  amount,
  timestamp,
  className,
  size,
  weight = "default",
}: ToggledAmountProps) => {
  const toggledAmount = useToggleUsdAmount({ token, amount, timestamp });
  return (
    <Metric
      label={label}
      className={cn("flex-grow", className)}
      metricSize={size}
      metricWeight={weight}
    >
      {toggledAmount}
    </Metric>
  );
};

const AuctionHeader = ({ auction }: PropsWithAuction) => {
  const batchAuction = auction as BatchAuction;

  const clearingPrice = Number(
    batchAuction.encryptedMarginalPrice?.marginalPrice ?? 0,
  );
  const fdv = Number(batchAuction.baseToken.totalSupply ?? 0) * clearingPrice;
  const auctionEndTimestamp = batchAuction?.formatted
    ? getTimestamp(batchAuction.formatted.endDate)
    : undefined;

  return (
    <div className="flex- flex items-end gap-x-[8px] pb-[16px]">
      {batchAuction.formatted?.cleared && (
        <>
          <ToggledAmount
            label="Clearing price"
            amount={clearingPrice}
            token={batchAuction.quoteToken}
            timestamp={auctionEndTimestamp}
            size="xl"
            className="min-w-[292px]"
          />
          <ToggledAmount
            label={`${batchAuction.quoteToken.symbol} Raised`}
            amount={Number(batchAuction.purchased) ?? 0}
            token={batchAuction.quoteToken}
            timestamp={auctionEndTimestamp}
            className="min-w-[188px]"
          />
          <ToggledAmount
            label="FDV"
            token={batchAuction.quoteToken}
            amount={fdv ?? 0}
            timestamp={auctionEndTimestamp}
            className="min-w-[188px]"
          />
        </>
      )}
      <Metric label="Participants" className="min-w-[188px] flex-grow">
        {batchAuction.formatted?.uniqueBidders}
      </Metric>
    </div>
  );
};

const SettledAuctionCard = (
  props: React.HTMLAttributes<HTMLDivElement> & PropsWithAuction,
) => {
  const { auction } = props;

  return (
    <Card className="h-[640px] flex-grow gap-16">
      <ToggleProvider initialToggle={true}>
        <AuctionHeader auction={auction} />
        <SettledAuctionChart auction={auction as BatchAuction} />
      </ToggleProvider>
    </Card>
  );
};

export { SettledAuctionCard };
