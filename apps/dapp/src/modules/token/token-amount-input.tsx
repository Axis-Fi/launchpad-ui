import { Input, Text, Button, cn } from "@repo/ui";

type TokenAmountInputProps = {
  label: string;
  symbol: string;
  usdPrice: string;
  balance: string;
  error?: string;
};

export function TokenAmountInput(props: TokenAmountInputProps) {
  return (
    <div
      className={cn(
        "hover:bg-surface-secondary bg-surface-tertiary group rounded border-2 border-transparent p-4 transition-all",
        props.error && "border-feedback-alert",
      )}
    >
      <Text color="secondary">{props.label}</Text>
      <div className="mt-0.5 flex items-center">
        <Text color="secondary" size="2xl">
          {props.symbol}{" "}
        </Text>
        <Input
          type="number"
          variant="lg"
          className="hover:bg-surface-secondary"
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
        {props.usdPrice && (
          <Text size="xs" color="secondary">
            {props.usdPrice}
          </Text>
        )}
        {props.balance && (
          <Text size="xs" color="secondary" uppercase>
            Balance: {props.balance}
          </Text>
        )}
      </div>
      {props.error && (
        <div className="bg-feedback-alert mt-1.5 rounded p-2">
          <Text color="tertiary">{props.error}</Text>
        </div>
      )}
    </div>
  );
}
