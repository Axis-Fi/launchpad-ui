import { Button } from "@repo/ui";
import { UseWaitForTransactionReceiptReturnType } from "wagmi";
import { TransactionHashCard } from "./transaction-hash-card";
import { Address } from "viem";
import {
  DialogRoot,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@repo/ui";
import React from "react";

export type TransactionDialogElementProps = {
  chainId?: number;
  hash?: Address;
  error?: Error | null;
};

export type TransactionScreens = Record<
  UseWaitForTransactionReceiptReturnType["status"] | "idle",
  {
    Component: React.FC<Partial<TransactionDialogElementProps>>;
    title?: string;
  }
>;

const defaultScreens: TransactionScreens = {
  idle: {
    Component: () => (
      <div className="my-4 text-center">Sign the transaction to proceed</div>
    ),
    title: "Confirm Transaction",
  },
  pending: { Component: TransactionHashCard, title: "Transaction Submitted!" },
  success: {
    Component: (props) => (
      <TransactionHashCard {...props} message="Transaction complete" />
    ),
    title: "Success!",
  },
  error: { Component: TransactionHashCard, title: "Transaction failed!" },
};

export type TransactionDialogProps = {
  onConfirm: React.MouseEventHandler<HTMLButtonElement>;
  mutation: UseWaitForTransactionReceiptReturnType;
  triggerContent?: string | React.ReactNode;
  screens?: Partial<TransactionScreens>;
  submitText?: string;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
} & TransactionDialogElementProps;

export function TransactionDialog({
  screens = defaultScreens,
  mutation: mutation,
  open,
  onOpenChange,
  ...props
}: TransactionDialogProps) {
  const allScreens = { ...defaultScreens, ...screens };

  const status = props.error
    ? "error"
    : props.hash && mutation
      ? mutation.status
      : "idle";

  const error = props.error ?? mutation?.error;

  const { Component, title } = allScreens[status];
  const showFooter = status === "idle";

  return (
    <DialogRoot open={open} onOpenChange={onOpenChange}>
      {props.triggerContent && (
        <DialogTrigger className="w-full " disabled={props.disabled}>
          <Button className="w-full max-w-sm" disabled={props.disabled}>
            {props.triggerContent}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-lg">
        <DialogHeader className="text-2xl">{title}</DialogHeader>

        <Component error={error} hash={props.hash} chainId={props.chainId} />

        <DialogFooter className="flex">
          {showFooter && (
            <Button
              type="submit"
              className="mx-auto w-full max-w-sm"
              onClick={(e) => {
                e.preventDefault();
                props.onConfirm(e);
              }}
            >
              {props.submitText ?? "CONFIRM"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
