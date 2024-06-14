import { FormField, FormItemWrapperSlim } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
import { formatUnits, parseUnits } from "viem";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { useEffect, useState } from "react";
import { useGetUsdAmount } from "./hooks/use-get-usd-amount";
import { trimCurrency } from "utils/currency";

export function AuctionBidInputSingle({
  auction,
  balance = BigInt(0),
  limit,
  disabled,
}: {
  balance?: bigint;
  limit?: bigint;
  disabled?: boolean;
} & PropsWithAuction) {
  const form = useFormContext<BidForm>();

  const [formAmountOut] = form.watch(["baseTokenAmount"]);

  // USD amount
  const [bidTimestamp] = useState<number>(Math.floor(Date.now() / 1000)); // Capture the timestamp when the page loads initially, otherwise the value will keep changing on every render, and the USD value will be refreshed on every render
  const [quoteTokenAmount, setQuoteTokenAmount] = useState<bigint>(BigInt(0));
  const { getUsdAmount } = useGetUsdAmount(auction.quoteToken, bidTimestamp);
  const [quoteTokenAmountUsd, setQuoteTokenAmountUsd] = useState<string>("");

  // Calculates the USD amount when the amountIn changes
  useEffect(() => {
    if (!quoteTokenAmount) {
      setQuoteTokenAmountUsd("");
      return;
    }

    const fetchedUsdAmount = getUsdAmount(quoteTokenAmount);
    if (!fetchedUsdAmount) {
      setQuoteTokenAmountUsd("");
      return;
    }

    setQuoteTokenAmountUsd(fetchedUsdAmount);
  }, [quoteTokenAmount, getUsdAmount]);

  function handleAmountOutChange(amountIn: bigint) {
    if (!auction.auctionData || !("price" in auction.auctionData)) return;

    // auction is fixed price
    // Use bigints to calculate value and return as string to avoid rounding errors with floats
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
                  balance={trimCurrency(
                    formatUnits(balance, auction.quoteToken.decimals),
                  )}
                  limit={
                    limit
                      ? trimCurrency(
                          formatUnits(limit, auction.quoteToken.decimals),
                        )
                      : undefined
                  }
                  usdPrice={quoteTokenAmountUsd}
                  symbol={auction.quoteToken.symbol}
                  onChange={(e) => {
                    field.onChange(e);

                    const rawAmountIn = (e.target as HTMLInputElement)
                      .value as string;
                    const amountIn = parseUnits(
                      rawAmountIn,
                      auction.quoteToken.decimals,
                    );
                    setQuoteTokenAmount(amountIn);

                    // Update amount out value, if applicable
                    handleAmountOutChange(amountIn);
                  }}
                  onClickMaxButton={() => {
                    // Take the minimum of the balance and the limit
                    let maxSpend = balance;
                    if (limit) {
                      maxSpend = balance < limit ? balance : limit;
                    }

                    const maxSpendStr = formatUnits(
                      maxSpend,
                      auction.quoteToken.decimals,
                    );

                    form.setValue("quoteTokenAmount", maxSpendStr);
                    // Force re-validation
                    form.trigger("quoteTokenAmount");

                    // Update amount out value, if applicable
                    handleAmountOutChange(maxSpend);
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
