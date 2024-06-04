import { FormField, FormItemWrapperSlim } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
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
  disabled,
}: {
  balance?: string;
  disabled?: boolean;
} & PropsWithAuction) {
  const form = useFormContext<BidForm>();

  const [formAmount, formMinAmountOut] = form.watch([
    "quoteTokenAmount",
    "baseTokenAmount",
  ]);

  const rate = Number(formAmount) / Number(formMinAmountOut);
  const formattedRate = isFinite(rate) ? formatRate(rate) : "";
  const showAmountOut =
    form.formState.isValid && isFinite(Number(formattedRate));

  // USD amount
  const [bidTimestamp] = useState<number>(Math.floor(Date.now() / 1000)); // Capture the timestamp when the page loads initially, otherwise the value will keep changing on every render, and the USD value will be refreshed on every render
  const [quoteTokenAmountDecimal, setQuoteTokenAmountDecimal] =
    useState<number>(0);
  const { getUsdAmount } = useGetUsdAmount(auction.quoteToken, bidTimestamp);
  const [quoteTokenAmountUsd, setQuoteTokenAmountUsd] = useState<string>("");

  // Calculates the USD amount when the amountIn changes
  useEffect(() => {
    if (!quoteTokenAmountDecimal) {
      setQuoteTokenAmountUsd("");
      return;
    }

    const fetchedUsdAmount = getUsdAmount(quoteTokenAmountDecimal);
    if (!fetchedUsdAmount) {
      setQuoteTokenAmountUsd("");
      return;
    }

    setQuoteTokenAmountUsd(fetchedUsdAmount);
  }, [quoteTokenAmountDecimal, getUsdAmount]);

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
                  usdPrice={quoteTokenAmountUsd}
                  symbol={auction.quoteToken.symbol}
                  onChange={(e) => {
                    field.onChange(e);

                    // Display USD value of input amount
                    const rawAmountIn = e.target.value as string;
                    setQuoteTokenAmountDecimal(Number(rawAmountIn));
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm pt-1">
        <div>
          <FormField
            name="baseTokenAmount"
            control={form.control}
            render={({ field }) => (
              <FormItemWrapperSlim>
                <TokenAmountInput
                  label="Bid Price"
                  symbol={`${auction.quoteToken.symbol} per ${auction.baseToken.symbol}`}
                  message={
                    showAmountOut
                      ? `If successful, you will receive at least: ${trimCurrency(
                          formattedRate,
                        )} ${auction.baseToken.symbol}`
                      : ""
                  }
                  {...field}
                  onChange={() => {
                    // Calculate the minAmountOut for the base token
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
        </div>
      </div>
    </div>
  );
}
