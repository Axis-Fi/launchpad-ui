import { TokenAmountInput } from "./token-amount-input";

const wrapper = {
  decimals: 18,
  symbol: "W",
  address: "0x",
};

export function TokenWrapper() {
  return (
    <div className="flex flex-col gap-y-4">
      <TokenAmountInput token={wrapper} />
      <TokenAmountInput token={wrapper} />
    </div>
  );
}
