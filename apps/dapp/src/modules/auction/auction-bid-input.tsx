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
  balance = BigInt(0),
  limit,
  disabled,
}: {
  balance?: bigint;
  limit?: bigint;
  disabled?: boolean;
} & PropsWithAuction) {
  const form = useFormContext<BidForm>();

  const [formAmount] = form.watch(["quoteTokenAmount"]);

  // USD amount
  const [bidTimestamp] = useState<number>(Math.floor(Date.now() / 1000)); // Capture the timestamp when the page loads initially, otherwise the value will keep changing on every render, and the USD value will be refreshed on every render);
  const { getUsdAmount } = useGetUsdAmount(auction.quoteToken, bidTimestamp);
  const [quoteTokenAmountUsd, setQuoteTokenAmountUsd] = useState<string>("");
  const [minAmountOutFormatted, setMinAmountOutFormatted] =
    useState<string>("");
  const [bidPrice, setBidPrice] = useState<string>("");
  const [bidPriceUsd, setBidPriceUsd] = useState<string>("");

  // Calculates the USD amount when the amountIn changes
  useEffect(() => {
    if (!formAmount || isNaN(Number(formAmount))) {
      setQuoteTokenAmountUsd("");
      return;
    }

    const fetchedUsdAmount = getUsdAmount(
      parseUnits(formAmount, auction.quoteToken.decimals),
    );
    if (!fetchedUsdAmount) {
      setQuoteTokenAmountUsd("");
      return;
    }

    setQuoteTokenAmountUsd(fetchedUsdAmount);
  }, [formAmount, auction.quoteToken.decimals, getUsdAmount]);

  // Calculates the USD amount of the bid price
  useEffect(() => {
    if (!bidPrice || isNaN(Number(bidPrice))) {
      setBidPriceUsd("");
      return;
    }

    const fetchedUsdAmount = getUsdAmount(
      parseUnits(bidPrice, auction.quoteToken.decimals),
    );
    if (!fetchedUsdAmount) {
      setBidPriceUsd("");
      return;
    }

    setBidPriceUsd(fetchedUsdAmount);
  }, [bidPrice, getUsdAmount]);

  const showAmountOut =
    form.formState.isValid && isFinite(Number(minAmountOutFormatted));

  const getMinAmountOut = (amountIn: bigint, price: bigint): bigint => {
    if (!amountIn || !price) {
      return BigInt(0);
    }

    return (amountIn * parseUnits("1", auction.baseToken.decimals)) / price;
  };

  const handleAmountOutChange = (amountIn: bigint) => {
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
                  balance={trimCurrency(
                    formatUnits(balance, auction.quoteToken.decimals),
                  )}
                  usdPrice={quoteTokenAmountUsd}
                  limit={
                    limit
                      ? trimCurrency(
                          formatUnits(limit, auction.quoteToken.decimals),
                        )
                      : undefined
                  }
                  symbol={auction.quoteToken.symbol}
                  onChange={(e) => {
                    field.onChange(e);

                    // Display USD value of input amount
                    const rawAmountIn = (e.target as HTMLInputElement)
                      .value as string;

                    // Update amount out value
                    handleAmountOutChange(
                      parseUnits(rawAmountIn, auction.quoteToken.decimals),
                    );
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

                    // Update amount out value
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
          <FormField
            name="bidPrice"
            control={form.control}
            render={({ field }) => (
              <FormItemWrapperSlim>
                <TokenAmountInput
                  {...field}
                  label="Bid Price"
                  disabled={disabled}
                  disableMaxButton={true}
                  symbol={`per ${auction.baseToken.symbol}`}
                  usdPrice={bidPriceUsd}
                  message={
                    showAmountOut
                      ? `If successful, you will receive at least: ${minAmountOutFormatted} ${auction.baseToken.symbol}`
                      : ""
                  }
                  onChange={(e) => {
                    field.onChange(e);

                    // Update amount out value
                    const rawPrice = (e.target as HTMLInputElement)
                      .value as string;
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
                    form.setValue("baseTokenAmount", minAmountOutDecimal);
                    setMinAmountOutFormatted(trimCurrency(minAmountOutDecimal));
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
