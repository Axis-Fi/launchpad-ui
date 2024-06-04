import { FormField, FormItemWrapperSlim } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
import { formatUnits, parseUnits } from "viem";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { trimCurrency } from "utils/currency";
import { useEffect, useState } from "react";
import { useGetUsdAmount } from "./hooks/use-get-usd-amount";

const formatRate = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
}).format;

export function AuctionBidInput({
  auction,
  balance = "0",
  singleInput,
  disabled,
}: {
  balance?: string;
  singleInput?: boolean;
  disabled?: boolean;
} & PropsWithAuction) {
  const form = useFormContext<BidForm>();

  const [amount, minAmountOut] = form.watch([
    "quoteTokenAmount",
    "baseTokenAmount",
  ]);

  const rate = Number(amount) / Number(minAmountOut);
  const formattedRate = isFinite(rate) ? formatRate(rate) : "";
  const showAmountOut =
    form.formState.isValid && isFinite(Number(minAmountOut));

  // USD amount
  const [bidTimestamp] = useState<number>(Math.floor(Date.now() / 1000));
  const [amountIn, setAmountIn] = useState<number | undefined>();
  // TODO fix the timestamp
  const { getUsdAmount } = useGetUsdAmount(auction.quoteToken, bidTimestamp);
  const [amountInUsd, setAmountInUsd] = useState<string | undefined>();

  useEffect(() => {
    if (!amountIn) {
      setAmountInUsd(undefined);
      return;
    }

    setAmountInUsd(getUsdAmount(amountIn));
  }, [amountIn, getUsdAmount]);

  return (
    <div className="text-foreground flex flex-col gap-y-2">
      <div className="bg-secondary flex justify-between rounded-sm pt-1">
        <div className="">
          <FormField
            name="quoteTokenAmount"
            control={form.control}
            render={({ field }) => (
              <FormItemWrapperSlim>
                <TokenAmountInput
                  {...field}
                  disabled={disabled}
                  label="Spend Amount"
                  balance={balance}
                  usdPrice={amountInUsd}
                  symbol={auction.quoteToken.symbol}
                  onChange={(e) => {
                    field.onChange(e);
                    if (singleInput && "price" in auction.auctionData!) {
                      // auction is fixed price
                      // Use bigints to calculate value and return as string to avoid rounding errors with floats
                      const rawAmountIn = e.target.value as string;
                      const amountIn = parseUnits(
                        rawAmountIn,
                        auction.quoteToken.decimals,
                      );
                      const amountOut =
                        (amountIn *
                          parseUnits("1", auction.baseToken.decimals)) /
                        auction.auctionData!.price;
                      const formattedAmountOut = formatUnits(
                        amountOut,
                        auction.baseToken.decimals,
                      );
                      form.setValue("baseTokenAmount", formattedAmountOut);

                      // Trigger refresh of USD value
                      setAmountIn(Number(rawAmountIn));
                    }
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm pt-1">
        <div>
          {singleInput ? (
            <TokenAmountInput
              disabled={disabled}
              symbol={auction.baseToken.symbol}
              label="Amount Received"
              value={minAmountOut}
              onChange={() => {}}
            />
          ) : (
            <FormField
              name="baseTokenAmount"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapperSlim>
                  <TokenAmountInput
                    label="Bid Price"
                    symbol={`per ${auction.baseToken.symbol}`}
                    usdPrice={formattedRate}
                    message={
                      showAmountOut
                        ? `If successful, you will receive at least: ${trimCurrency(
                            minAmountOut,
                          )} ${auction.baseToken.symbol}`
                        : ""
                    }
                    {...field}
                  />
                </FormItemWrapperSlim>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
