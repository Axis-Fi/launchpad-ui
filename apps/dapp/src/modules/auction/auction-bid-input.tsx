import { Auction } from "src/types";
import { IconedLabel, Input } from "@repo/ui";
import { ChangeEventHandler } from "react";
import React from "react";

const formatRate = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
}).format;

export function AuctionBidInput({
  auction,
  balance = 0,
  ...props
}: {
  auction: Auction;
  balance?: number;
  onChangeAmountIn: ChangeEventHandler<HTMLInputElement>;
  onChangeMinAmountOut: ChangeEventHandler<HTMLInputElement>;
}) {
  const [amount, setAmount] = React.useState<number>(0);
  const [minAmountOut, setMinAmountOut] = React.useState<number>(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
    props.onChangeAmountIn(e);
  };

  const handleMinAmountOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinAmountOut(Number(e.target.value));
    props.onChangeMinAmountOut(e);
  };

  const rate = amount / minAmountOut;
  const formattedRate = isFinite(rate) ? formatRate(rate) : "?";

  return (
    <div className="flex flex-col gap-y-2">
      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
          <p className="mb-1">You pay</p>
          <IconedLabel
            src={auction.quoteToken.logoURL}
            label={auction.quoteToken.symbol}
          />
          <Input
            type="number"
            onChange={handleAmountChange}
            variant="lg"
            className="mt-1 w-full"
            placeholder="0.00"
          />
        </div>
        <div className="flex w-full flex-col items-end justify-end">
          <p className="text-foreground/50">
            Balance:{" "}
            <p className="text-foreground inline">
              {balance} {auction.quoteToken.symbol}
            </p>
          </p>
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
          <p className="mb-1">You pay</p>
          <IconedLabel
            src={auction.quoteToken.logoURL}
            label={auction.quoteToken.symbol}
          />
          <Input
            type="number"
            onChange={handleMinAmountOutChange}
            variant="lg"
            className="mt-1 w-full"
            placeholder="0.00"
          />
        </div>
        <div className="flex w-full flex-col items-end justify-end">
          <p className="text-foreground/50">
            Rate:{" "}
            <p className="text-foreground inline">
              {formattedRate} {auction.quoteToken.symbol}/
              {auction.baseToken.symbol}
            </p>
          </p>
        </div>
      </div>
    </div>
  );
}
