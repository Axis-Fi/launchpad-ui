import { Input, Text, Button, cn } from "@repo/ui";

type TokenAmountInputProps = React.HTMLAttributes<HTMLInputElement> & {
  /** the input's label */
  label: string;
  /** the token's symbol */
  symbol: string;
  /** the USD price of the token*/
  usdPrice?: string;
  /** the user's balance */
  balance?: string;
  /** an optional error message */
  error?: string;
  /** an optional status message */
  message?: string;
  /** the current input value */
  value?: string;
  /** whether to disable the input */
  disabled?: boolean;
};

export function TokenAmountInput({
  label,
  symbol,
  usdPrice,
  balance,
  error,
  message,
  value,
  disabled,
  ...props
}: TokenAmountInputProps) {
  return (
    <div
      className={cn(
        "hover:bg-surface-secondary bg-surface-tertiary group rounded border-2 border-transparent p-4 transition-all",
        error && "border-feedback-alert",
        disabled && "opacity-50",
      )}
    >
      <Text color="secondary">{label}</Text>
      <div className="mt-0.5 flex items-center">
        <Input
          {...props}
          value={value}
          type="number"
          variant="lg"
          disabled={disabled}
          placeholder="0"
          className={cn(
            "hover:bg-surface-secondary ml-0 pl-0",
            error && "text-feedback-alert",
          )}
        />
        <Text className="text-nowrap" color="secondary" size="lg">
          {symbol}{" "}
        </Text>
        <Button
          disabled={disabled}
          uppercase
          variant="secondary"
          size="sm"
          className="ml-1 h-min rounded-full px-1.5 py-1 leading-none"
        >
          Max
        </Button>
      </div>
      <div className="flex justify-between">
        {usdPrice && (
          <Text size="xs" color="secondary">
            ≈{usdPrice}
          </Text>
        )}
        {balance && (
          <Text size="xs" color="secondary" uppercase>
            Balance: {balance}
          </Text>
        )}
      </div>
      {error && (
        <div className="bg-feedback-alert mt-1.5 rounded p-2">
          <Text color="tertiary">{error}</Text>
        </div>
      )}

      {message && (
        <div className="mt-1.5 rounded border border-neutral-500 p-2">
          <Text color="secondary">{message}</Text>
        </div>
      )}
    </div>
  );
}
