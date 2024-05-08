import { FormField, FormItemWrapper, IconedLabel, Input } from "@repo/ui";
import { useFormContext } from "react-hook-form";
import { PropsWithAuction } from "@repo/types";
import { BidForm } from "./status";
import { formatUnits, parseUnits } from "viem";

const formatRate = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 4,
  minimumFractionDigits: 0,
}).format;

export function AuctionBidInput({
  auction,
  balance = "0",
  singleInput,
}: {
  balance?: string;
  singleInput?: boolean;
} & PropsWithAuction) {
  const form = useFormContext<BidForm>();

  const [amount, minAmountOut] = form.watch([
    "quoteTokenAmount",
    "baseTokenAmount",
  ]);

  const rate = amount / minAmountOut;
  const formattedRate = isFinite(rate) ? formatRate(rate) : "?";

  return (
    <div className="text-foreground flex flex-col gap-y-2">
      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
          <p className="mb-1">You pay</p>
          <IconedLabel
            src={auction.quoteToken?.logoURI}
            label={auction.quoteToken.symbol}
          />
          <FormField
            name="quoteTokenAmount"
            control={form.control}
            render={({ field }) => (
              <FormItemWrapper errorClassName="-top-16 text-nowrap">
                <div className="flex">
                  <Input
                    type="number"
                    {...field}
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
                          (value *
                            parseUnits("1", auction.baseToken.decimals)) /
                          auction.auctionData!.price;
                        const formattedAmount = formatUnits(
                          amount,
                          auction.baseToken.decimals,
                        );
                        form.setValue("baseTokenAmount", formattedAmount);
                      }
                    }}
                    variant="lg"
                    className="mt-4 w-full"
                    placeholder="0.00"
                  />

                  <div className="flex w-full cursor-pointer flex-col items-end justify-end">
                    <p className="text-foreground/50">
                      Balance:{" "}
                      <span className="text-foreground inline">
                        {balance} {auction.quoteToken.symbol}
                      </span>
                    </p>
                  </div>
                </div>
              </FormItemWrapper>
            )}
          />
        </div>
      </div>

      <div className="bg-secondary flex justify-between rounded-sm p-2 pt-1">
        <div>
          <p className="mb-1">You get</p>
          <IconedLabel
            src={auction.baseToken.logoURI}
            label={auction.baseToken.symbol}
          />
          {singleInput ? (
            <Input
              type="number"
              className="mt-4"
              variant="lg"
              value={minAmountOut}
              onChange={() => {}}
            />
          ) : (
            <FormField
              name="baseTokenAmount"
              control={form.control}
              render={({ field }) => (
                <FormItemWrapper errorClassName="-top-16">
                  <div className="flex">
                    <Input
                      type="number"
                      {...field}
                      variant="lg"
                      className="mt-4 w-full"
                      placeholder="0.00"
                    />
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
                </FormItemWrapper>
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
}
