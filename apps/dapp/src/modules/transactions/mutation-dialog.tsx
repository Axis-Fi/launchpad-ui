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
import { WaitForTransactionReceiptErrorType } from "wagmi/actions";
import { UseMutationResult } from "@tanstack/react-query";

export type MutationDialogElementProps = {
  chainId?: number;
  hash?: Address;
  error?: WaitForTransactionReceiptErrorType | null;
};

export type MutationScreens = Record<
  Partial<UseWaitForTransactionReceiptReturnType["status"] | "idle">,
  { Component: React.FC<Partial<MutationDialogElementProps>>; title?: string }
>;

export type MutationDialogProps = {
  onConfirm: () => void;
  mutation: UseWaitForTransactionReceiptReturnType;
  triggerContent: string | React.ReactNode;
  screens?: MutationScreens;
  submitText?: string;
  error?: UseMutationResult["error"];
  disabled?: boolean;
} & MutationDialogElementProps;

const defaultScreens: MutationScreens = {
  idle: {
    Component: () => (
      <div className="my-4 text-center">This action is irreversible</div>
    ),
    title: "Confirm Transaction",
  },
  pending: { Component: TransactionHashCard, title: "Transaction Submitted!" },
  success: { Component: TransactionHashCard, title: "Success!" },
  error: { Component: TransactionHashCard, title: "Transaction failed!" },
};

export function MutationDialog({
  screens = defaultScreens,
  mutation,
  ...props
}: MutationDialogProps) {
  const allScreens = { ...defaultScreens, ...screens };
  const status = props.error ? "error" : props.hash ? mutation.status : "idle";

  const error = props.error ?? mutation?.error;

  const { Component, title } = allScreens[status];
  const showFooter = status === "idle";

  return (
    <DialogRoot>
      <DialogTrigger className="w-full " disabled={props.disabled}>
        <Button className="w-full max-w-sm" disabled={props.disabled}>
          {props.triggerContent}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-2xl">{title}</DialogHeader>
        <Component error={error} hash={props.hash} chainId={props.chainId} />

        <DialogFooter className="flex">
          {showFooter && (
            <Button
              type="submit"
              className="mx-auto w-full max-w-sm"
              onClick={(e) => {
                console.log("preventing");
                e.preventDefault();
                props.onConfirm();
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
