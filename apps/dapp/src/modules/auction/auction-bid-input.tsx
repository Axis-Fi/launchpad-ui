import { FormField, FormItemWrapperSlim } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
import { formatUnits, parseUnits } from "viem";
import { TokenAmountInput } from "modules/token/token-amount-input";
import { trimCurrency } from "utils/currency";

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
  const formattedRate = isFinite(rate) ? formatRate(rate) : "?";
  const showAmountOut =
    form.formState.isValid && isFinite(Number(minAmountOut));

  return (
    <div className="text-foreground flex flex-col gap-y-2">
      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
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
                  symbol={auction.quoteToken.symbol}
                  onChange={(e) => {
                    field.onChange(e);
                    if (singleInput && "price" in auction.auctionData!) {
                      // auction is fixed price
                      // Use bigints to calculate value and return as string to avoid rounding errors with floats
                      const value = parseUnits(
                        e.target.value,
                        auction.quoteToken.decimals,
                      );
                      const amount =
                        (value * parseUnits("1", auction.baseToken.decimals)) /
                        auction.auctionData!.price;
                      const formattedAmount = formatUnits(
                        amount,
                        auction.baseToken.decimals,
                      );
                      form.setValue("baseTokenAmount", formattedAmount);
                    }
                  }}
                />
              </FormItemWrapperSlim>
            )}
          />
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
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
                    label="Maximum Bid Amount"
                    symbol={auction.formatted?.tokenPairSymbols ?? ""}
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
