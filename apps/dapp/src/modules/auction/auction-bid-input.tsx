import { Auction } from "src/types";
import { IconedLabel, Input } from "@repo/ui";
import { ChangeEventHandler } from "react";

export function AuctionBidInput({
  auction,
  balance = 0,
  minAmountOut,
  ...props
}: {
  auction: Auction;
  balance?: number;
  minAmountOut?: number;
  onChangeAmount: ChangeEventHandler<HTMLInputElement>;
  onChangeMaxPrice: ChangeEventHandler<HTMLInputElement>;
}) {
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
            onChange={props.onChangeAmount}
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

      <div className="flex gap-x-2 rounded-sm pt-1">
        <div className="bg-secondary rounded-sm p-2">
          <p className="mb-1">With a max price of</p>

          <div className="flex justify-center">
            {auction.quoteToken.symbol}
            <p className="text-xl"> / </p>
            {auction.baseToken.symbol}
          </div>
          <Input
            type="number"
            onChange={props.onChangeAmount}
            variant="lg"
            className="mt-1 w-full"
            placeholder="0.00"
          />
        </div>
        <div className="bg-secondary rounded-sm p-2">
          <p className="mb-1">You get</p>
          <IconedLabel
            src={auction.baseToken.logoURL}
            label={auction.baseToken.symbol}
          />

          <Input
            variant="lg"
            disabled
            placeholder="0.00"
            className="mt-1 w-full text-4xl font-light"
            value={minAmountOut}
          />
        </div>
      </div>
    </div>
  );
}
