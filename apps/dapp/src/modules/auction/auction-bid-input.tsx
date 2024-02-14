import { IconedLabel, Input } from "@repo/ui";
import React from "react";
import { PropsWithAuction } from ".";

const formatRate = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
}).format;

export function AuctionBidInput({
  auction,
  balance = "0",
  ...props
}: {
  balance?: string;
  onChangeAmountIn: (value: string) => void;
  onChangeMinAmountOut: (value: string) => void;
} & PropsWithAuction) {
  const [amount, setAmount] = React.useState<number>(0);
  const [minAmountOut, setMinAmountOut] = React.useState<number>(0);

  const handleAmountChange = (value: string) => {
    setAmount(Number(value));
    props.onChangeAmountIn(value);
  };

  const handleMinAmountOutChange = (value: string) => {
    setMinAmountOut(Number(value));
    props.onChangeMinAmountOut(value);
  };

  const rate = amount / minAmountOut;
  const formattedRate = isFinite(rate) ? formatRate(rate) : "?";

  return (
    <div className="text-foreground flex flex-col gap-y-2">
      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
          <p className="mb-1">You pay</p>
          <IconedLabel
            src={auction.quoteToken?.logoURL}
            label={auction.quoteToken.symbol}
          />
          <Input
            type="number"
            onChange={(e) => handleAmountChange(e.target.value)}
            variant="lg"
            className="mt-1 w-full"
            placeholder="0.00"
          />
        </div>
        <div
          className="flex w-full cursor-pointer flex-col items-end justify-end"
          onClick={() => handleAmountChange(balance)}
        >
          <p className="text-foreground/50">
            Balance:{" "}
            <span className="text-foreground inline">
              {balance} {auction.quoteToken.symbol}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
          <p className="mb-1">You get</p>
          <IconedLabel
            src={auction.baseToken.logoURL}
            label={auction.baseToken.symbol}
          />
          <Input
            type="number"
            onChange={(e) => handleMinAmountOutChange(e.target.value)}
            variant="lg"
            className="mt-1 w-full"
            placeholder="0.00"
          />
        </div>
        <div className="flex w-full flex-col items-end justify-end">
          <p className="text-foreground/50">
            Rate:{" "}
            <span className="text-foreground inline">
              {formattedRate} {auction.quoteToken.symbol}/
              {auction.baseToken.symbol}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
