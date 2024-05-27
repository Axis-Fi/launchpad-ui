import { Input, Text, Button, cn } from "@repo/ui";

type TokenAmountInputProps = React.HTMLAttributes<HTMLInputElement> & {
  label: string;
  symbol: string;
  usdPrice?: string;
  balance?: string;
  error?: string;
};

export function TokenAmountInput({
  label,
  symbol,
  usdPrice,
  balance,
  error,
  ...props
}: TokenAmountInputProps) {
  return (
    <div
      className={cn(
        "hover:bg-surface-secondary bg-surface-tertiary group rounded border-2 border-transparent p-4 transition-all",
        error && "border-feedback-alert",
      )}
    >
      <Text color="secondary">{label}</Text>
      <div className="mt-0.5 flex items-center">
        <Text color="secondary" size="2xl">
          {symbol}{" "}
        </Text>
        <Input
          {...props}
          type="number"
          variant="lg"
          className={cn(
            "hover:bg-surface-secondary",
            error && "text-feedback-alert",
          )}
        />
        <Button
          uppercase
          variant="secondary"
          size="sm"
          className="h-min rounded-full px-1.5 py-1 leading-none"
        >
          Max
        </Button>
      </div>
      <div className="flex justify-between">
        {usdPrice && (
          <Text size="xs" color="secondary">
            {usdPrice}
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
    </div>
  );
}
