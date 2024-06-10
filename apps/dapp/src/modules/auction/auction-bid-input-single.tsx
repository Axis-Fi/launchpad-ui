import { FormField, FormItemWrapperSlim } from "@repo/ui";
import { UseFormReturn } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
import { formatUnits, parseUnits } from "viem";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { useEffect, useState } from "react";
import { useGetUsdAmount } from "./hooks/use-get-usd-amount";
import { trimCurrency } from "utils/currency";

export function AuctionBidInputSingle({
  form,
  auction,
  balance = 0,
  limit,
  disabled,
}: {
  form: UseFormReturn<BidForm>;
  balance?: number;
  limit?: number;
  disabled?: boolean;
} & PropsWithAuction) {
  const [formAmountOut] = form.watch(["baseTokenAmount"]);

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

  function handleAmountOutChange(value: string) {
    if (!auction.auctionData || !("price" in auction.auctionData)) return;

    // auction is fixed price
    // Use bigints to calculate value and return as string to avoid rounding errors with floats
    const amountIn = parseUnits(value, auction.quoteToken.decimals);
    const amountOut =
      (amountIn * parseUnits("1", auction.baseToken.decimals)) /
      auction.auctionData!.price;
    const formattedAmountOut = formatUnits(
      amountOut,
      auction.baseToken.decimals,
    );
    form.setValue("baseTokenAmount", formattedAmountOut);
  }

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
                  balance={trimCurrency(balance)}
                  limit={limit ? trimCurrency(limit) : undefined}
                  usdPrice={quoteTokenAmountUsd}
                  symbol={auction.quoteToken.symbol}
                  onChange={(e) => {
                    field.onChange(e);

                    const rawAmountIn = (e.target as HTMLInputElement)
                      .value as string;
                    setQuoteTokenAmountDecimal(Number(rawAmountIn));

                    // Update amount out value, if applicable
                    handleAmountOutChange(rawAmountIn);
                  }}
                  onClickMaxButton={() => {
                    // Take the minimum of the balance and the limit
                    let maxSpend = balance;
                    if (limit) {
                      maxSpend = balance < limit ? balance : limit;
                    }

                    const maxSpendStr = maxSpend.toString();

                    form.setValue("quoteTokenAmount", maxSpendStr);
                    // Force re-validation
                    form.trigger("quoteTokenAmount");

                    // Update amount out value, if applicable
                    handleAmountOutChange(maxSpendStr);
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm pt-1">
        <div>
          <TokenAmountInput
            disabled={disabled}
            disableMaxButton={true}
            symbol={auction.baseToken.symbol}
            label="Amount Received"
            value={formAmountOut}
            onChange={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
