import { formatUnits } from "viem";
import { cn, InfoLabel, ToggleProvider, type InfoLabelProps } from "@repo/ui";
import type { Token, EMPAuctionData, PropsWithAuction } from "@repo/types";
import { SettledAuctionChart } from "./settled-auction-chart";
import { useToggleUsdAmount } from "./hooks/use-toggle-usd-amount";
import { getTimestamp } from "utils/date";

type ToggledAmountLabelProps = {
  token: Token;
  amount: number;
  timestamp?: number;
} & Omit<InfoLabelProps, "value">;

const ToggledAmountLabel = ({
  token,
  amount,
  timestamp,
  ...rest
}: ToggledAmountLabelProps) => {
  const usdAmount = useToggleUsdAmount({ token, amount, timestamp });
  return <InfoLabel {...rest} value={usdAmount} />;
};

const AuctionHeader = ({ auction }: PropsWithAuction) => {
  const clearingPrice = Number(
    formatUnits(
      (auction?.auctionData as EMPAuctionData)?.marginalPrice ?? 0,
      Number(auction.quoteToken.decimals),
    ),
  );
  const fdv = (Number(auction.baseToken.totalSupply) ?? 0) * clearingPrice;
  const auctionEndTimestamp = auction?.formatted
    ? getTimestamp(auction.formatted.endDate)
    : undefined;

  return (
    <div className="mx-6 my-4 flex items-start justify-between">
      <ToggledAmountLabel
        reverse={true}
        label="Clearing price"
        amount={clearingPrice}
        token={auction.quoteToken}
        valueSize="lg"
        timestamp={auctionEndTimestamp}
      />
      <ToggledAmountLabel
        reverse={true}
        label="Total Raised"
        amount={Number(auction?.purchased) ?? 0}
        token={auction.quoteToken}
        timestamp={auctionEndTimestamp}
      />
      <ToggledAmountLabel
        reverse={true}
        label="FDV"
        token={auction.quoteToken}
        amount={fdv ?? 0}
        timestamp={auctionEndTimestamp}
      />
      <InfoLabel
        reverse={true}
        label="Participants"
        value={auction.formatted?.uniqueBidders}
      />
    </div>
  );
};

const SettledAuctionCard = (
  props: React.HTMLAttributes<HTMLDivElement> & PropsWithAuction,
) => {
  const { className, auction } = props;
  return (
    <div
      className={cn("mr-4", className)}
      style={{ backgroundColor: "#252026" }}
    >
      <ToggleProvider initialIsToggled={true}>
        <AuctionHeader auction={auction} />
        <SettledAuctionChart lotId={auction.lotId} chainId={auction.chainId} />
      </ToggleProvider>
    </div>
  );
};

export { SettledAuctionCard };
