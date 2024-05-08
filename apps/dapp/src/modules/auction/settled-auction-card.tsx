import { formatUnits } from "viem";
import {
  cn,
  InfoLabel,
  ToggleProvider,
  UsdToggle,
  type InfoLabelProps,
} from "@repo/ui";
import type { Token, EMPAuctionData, PropsWithAuction } from "@repo/types";
import { SettledAuctionChart } from "./settled-auction-chart";
import { useToggleUsdValue } from "./hooks/use-toggle-usd-value";

type ToggledAmountLabelProps = {
  token: Token;
  amount: number;
} & Omit<InfoLabelProps, "value">;

const ToggledAmountLabel = ({
  token,
  amount,
  ...rest
}: ToggledAmountLabelProps) => {
  const usdValue = useToggleUsdValue({ token, amount });
  return <InfoLabel {...rest} value={usdValue} />;
};

const AuctionHeader = ({ auction }: PropsWithAuction) => {
  const clearingPrice = Number(
    formatUnits(
      (auction?.auctionData as EMPAuctionData)?.marginalPrice ?? 0,
      Number(auction.quoteToken.decimals),
    ),
  );
  const fdv = (Number(auction.baseToken.totalSupply) ?? 0) * clearingPrice;

  return (
    <div className="mx-6 my-4 flex items-start justify-between">
      <ToggledAmountLabel
        reverse={true}
        label="Clearing price"
        amount={clearingPrice}
        token={auction.quoteToken}
        valueSize="lg"
      />
      <ToggledAmountLabel
        reverse={true}
        label="Total Raised"
        amount={Number(auction?.purchased) ?? 0}
        token={auction.quoteToken}
      />
      <ToggledAmountLabel
        reverse={true}
        label="FDV"
        token={auction.quoteToken}
        amount={fdv ?? 0}
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
        <SettledAuctionChart
          overlay={() => (
            <div className="mr-8 mt-4 flex justify-end">
              <UsdToggle currencySymbol={auction.quoteToken.symbol} />
            </div>
          )}
          lotId={auction.lotId}
          chainId={auction.chainId}
        />
      </ToggleProvider>
    </div>
  );
};

export { SettledAuctionCard };
