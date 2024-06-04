import { FormField, FormItemWrapperSlim } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { trimCurrency } from "utils/currency";
import { useEffect, useState } from "react";
import { useGetUsdAmount } from "./hooks/use-get-usd-amount";
import { formatUnits, parseUnits } from "viem";

export function AuctionBidInput({
  auction,
  balance = "0",
  disabled,
}: {
  balance?: string;
  disabled?: boolean;
} & PropsWithAuction) {
  const form = useFormContext<BidForm>();

  const [formAmount] = form.watch(["quoteTokenAmount"]);

  // USD amount
  const [bidTimestamp] = useState<number>(Math.floor(Date.now() / 1000)); // Capture the timestamp when the page loads initially, otherwise the value will keep changing on every render, and the USD value will be refreshed on every render);
  const { getUsdAmount } = useGetUsdAmount(auction.quoteToken, bidTimestamp);
  const [quoteTokenAmountUsd, setQuoteTokenAmountUsd] = useState<string>("");

  // Calculates the USD amount when the amountIn changes
  useEffect(() => {
    if (!formAmount || isNaN(Number(formAmount))) {
      setQuoteTokenAmountUsd("");
      return;
    }

    const fetchedUsdAmount = getUsdAmount(Number(formAmount));
    if (!fetchedUsdAmount) {
      setQuoteTokenAmountUsd("");
      return;
    }

    setQuoteTokenAmountUsd(fetchedUsdAmount);
  }, [formAmount, getUsdAmount]);

  const [bidPrice, setBidPrice] = useState<string>("");

  const [minAmountOutFormatted, setMinAmountOutFormatted] =
    useState<string>("");
  const showAmountOut =
    form.formState.isValid && isFinite(Number(minAmountOutFormatted));
  console.log("isValid", form.formState.isValid);
  console.log("errors", JSON.stringify(form.formState.errors));

  const getMinAmountOut = (amountIn: bigint, price: bigint): bigint => {
    if (!amountIn || !price) {
      return BigInt(0);
    }

    return (amountIn * parseUnits("1", auction.baseToken.decimals)) / price;
  };

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

                    // Update amount out value
                    const amountIn = parseUnits(
                      rawAmountIn,
                      auction.quoteToken.decimals,
                    );
                    const minAmountOut = getMinAmountOut(
                      amountIn,
                      parseUnits(bidPrice, auction.quoteToken.decimals),
                    );
                    const minAmountOutDecimal = formatUnits(
                      minAmountOut,
                      auction.baseToken.decimals,
                    );
                    form.setValue("baseTokenAmount", minAmountOutDecimal);
                    setMinAmountOutFormatted(trimCurrency(minAmountOutDecimal));
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm pt-1">
        <div>
          {/* TODO No errors are displaying, but the form is marked as invalid. This section below should be removed once the error is determined. */}
          <FormField
            name="baseTokenAmount"
            control={form.control}
            render={({ field }) => (
              <FormItemWrapperSlim>
                <TokenAmountInput
                  {...field}
                  label="Bid Price"
                  disableMaxButton={true}
                  symbol={`per ${auction.baseToken.symbol}`}
                  message={
                    showAmountOut
                      ? `If successful, you will receive at least: ${minAmountOutFormatted} ${auction.baseToken.symbol}`
                      : ""
                  }
                  onChange={(e) => {
                    // Update amount out value
                    const rawPrice = e.target.value as string;
                    field.onChange(rawPrice);

                    setBidPrice(rawPrice);

                    const price = parseUnits(
                      rawPrice,
                      auction.quoteToken.decimals,
                    );

                    const minAmountOut = getMinAmountOut(
                      parseUnits(formAmount, auction.quoteToken.decimals),
                      price,
                    );
                    const minAmountOutDecimal = formatUnits(
                      minAmountOut,
                      auction.baseToken.decimals,
                    );
                    setMinAmountOutFormatted(trimCurrency(minAmountOutDecimal));
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
          <TokenAmountInput
            disabled={true}
            disableMaxButton={true}
            label="Receive Amount"
            symbol={auction.baseToken.symbol}
            value={minAmountOutFormatted}
          />
        </div>
      </div>
    </div>
  );
}
