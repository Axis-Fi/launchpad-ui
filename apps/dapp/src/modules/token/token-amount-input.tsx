import React from "react";
import { parseUnits } from "viem";
import type { Token } from "@repo/types";
import { Input, Text, Button, cn } from "@repo/ui";
import { UsdAmount } from "modules/auction/usd-amount";

type TokenAmountInputProps = React.HTMLProps<HTMLInputElement> & {
  /** the input's label */
  label: string;
  /** the input's token label, defaults to the token's symbol */
  tokenLabel?: string;
  /** the input's token type */
  token: Token;
  /** whether to show the USD price of the token */
  showUsdPrice?: boolean;
  /** the user's balance */
  balance?: string;
  /** limit on how much the user can spend */
  limit?: string;
  /** an optional error message */
  error?: string;
  /** an optional status message */
  message?: string;
  /** the current input value */
  value?: string;
  /** whether to disable the input */
  disabled?: boolean;
  /** whether to disable the max button */
  disableMaxButton?: boolean;
  /** callback when the max button is clicked */
  onClickMaxButton?: () => void;
};

export const TokenAmountInput = React.forwardRef<
  HTMLInputElement,
  TokenAmountInputProps
>(
  (
    {
      label,
      token,
      showUsdPrice = true,
      tokenLabel = token.symbol,
      balance,
      limit,
      error,
      message,
      value,
      disabled,
      disableMaxButton,
      onClickMaxButton,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "hover:bg-surface-secondary bg-surface-tertiary group rounded border-2 border-transparent p-4 transition-all",
          error && "border-feedback-alert",
          disabled && "opacity-50",
        )}
      >
        <div className="flex">
          <div className="flex-start">
            <Text color="secondary">{label}</Text>
          </div>
        </div>
        <div className="mt-0.5 flex items-center">
          <Input
            value={value}
            type="number"
            variant="lg"
            disabled={disabled}
            placeholder="0"
            className={cn(
              "hover:bg-surface-secondary ml-0 pl-0",
              error && "text-feedback-alert",
            )}
            {...props}
            ref={ref}
          />
          <Text className="text-nowrap" color="secondary" size="lg">
            {tokenLabel}{" "}
          </Text>
          {!disableMaxButton && (
            <Button
              disabled={disabled}
              uppercase
              variant="secondary"
              size="sm"
              className="ml-1 h-min rounded-full px-1.5 py-1 leading-none"
              onClick={() => {
                onClickMaxButton?.();
              }}
            >
              Max
            </Button>
          )}
        </div>
        <div className="flex justify-between">
          {showUsdPrice && (
            <div className="flex items-start">
              <Text size="xs" color="secondary">
                {!value && "$0"}
                {value && "≈ "}
                {value && (
                  <UsdAmount
                    token={token}
                    amount={parseUnits(value ?? "0", token.decimals)}
                  />
                )}
              </Text>
            </div>
          )}
          {balance && (
            <div className="ml-auto flex items-end">
              <Text size="xs" color="secondary" uppercase>
                Balance: {balance} {limit ? `Limit: ${limit}` : ""}
              </Text>
            </div>
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
  },
);

TokenAmountInput.displayName = "TokenAmountInput";
