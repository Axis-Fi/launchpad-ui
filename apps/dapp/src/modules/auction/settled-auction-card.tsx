import { formatUnits } from "viem";
import {
  InfoLabel,
  ToggleProvider,
  UsdToggle,
  type InfoLabelProps,
} from "@repo/ui";
import { type EMPAuctionData, type PropsWithAuction } from "@repo/types";

import { SettledAuctionChart } from "./settled-auction-chart";
import { ToggledAmount, type ToggledAmountProps } from "./toggled-amount";

type ToggledAmountLabelProps = ToggledAmountProps &
  Omit<InfoLabelProps, "value">;

const ToggledAmountLabel = ({
  symbol,
  amount,
  chainId,
  ...rest
}: ToggledAmountLabelProps) => {
  return (
    <InfoLabel
      {...rest}
      value={
        <ToggledAmount symbol={symbol} amount={amount} chainId={chainId} />
      }
    />
  );
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
        symbol={auction.quoteToken.symbol}
        amount={clearingPrice}
        chainId={auction.chainId}
      />
      <ToggledAmountLabel
        reverse={true}
        label="Total Raised"
        symbol={auction.quoteToken.symbol}
        amount={auction?.purchased ?? 0}
        chainId={auction.chainId}
      />
      <ToggledAmountLabel
        reverse={true}
        label="FDV"
        symbol={auction.quoteToken.symbol}
        amount={fdv ?? 0}
        chainId={auction.chainId}
      />
      <InfoLabel
        reverse={true}
        label="Participants"
        value={auction.formatted?.uniqueBidders}
      />
    </div>
  );
};

const SettledAuctionCard = ({ auction }: PropsWithAuction) => {
  return (
    <div className="mr-4 w-[60%]" style={{ backgroundColor: "#252026" }}>
      <ToggleProvider initialIsToggled={true}>
        <AuctionHeader auction={auction} />
        <SettledAuctionChart
          overlay={() => (
            <div className="mr-4 mt-2 flex justify-end">
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
