import { PriceSlider } from "./price-slider";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { PropsWithAuction } from "@axis-finance/types";

export function AuctionSealedBid({ auction }: PropsWithAuction) {
  const quoteSymbol = auction.quoteToken.symbol;
  const label = `${quoteSymbol} for ${auction.baseToken.symbol}`;

  return (
    <div className="space-y-8">
      {" "}
      <div className="space-y-2">
        <TokenAmountInput
          disableMaxButton
          tokenLabel={label}
          token={auction.quoteToken}
        />
        <PriceSlider min={20} />
      </div>
      <TokenAmountInput token={auction.quoteToken} />
    </div>
  );
}
