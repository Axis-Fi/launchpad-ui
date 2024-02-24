import { UseMutationResult } from "@tanstack/react-query";
import {
  BoxIcon,
  LockIcon,
  RadioTowerIcon,
  UnlockIcon,
  UploadCloudIcon,
} from "lucide-react";
import { StatusIcon, StatusSeparator } from "components/status-indicator";
import {
  UseWaitForTransactionReceiptReturnType,
  UseWriteContractReturnType,
} from "wagmi";
import { Button, Form, cn } from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { useFormContext } from "react-hook-form";
import { CreateAuctionForm } from "pages/create-auction-page";
import { Address, BaseError } from "viem";

type CreateAuctionStatusCardProps = {
  info: UseMutationResult<string, Error, CreateAuctionForm>;
  keypair: UseMutationResult<Address, Error, void, unknown>;
  tx: UseWriteContractReturnType;
  txReceipt: UseWaitForTransactionReceiptReturnType;
  chainId: number;
  onSubmit: () => void;
};

/** Displays the status, confirmations and errors of the
 * several steps that occur when submitting an auction for creation */
export function AuctionCreationStatus({
  info,
  keypair,
  tx,
  txReceipt,
  chainId,
  onSubmit,
}: CreateAuctionStatusCardProps) {
  const isStoringInfo = !info.isIdle && info.isPending;
  const isMakingKeys = !keypair.isIdle && keypair.isPending;
  const isSigningTx = !tx.isIdle && tx.isPending;
  const { isLoading: isTxConfirming, isSuccess } = txReceipt;
  const form = useFormContext();

  const isIdle = [
    isStoringInfo,
    isMakingKeys,
    isSigningTx,
    isTxConfirming,
    isSuccess,
  ].every((is) => !is);

  const queries = [info, keypair, tx, txReceipt];
  const error = queries.find((m) => m.isError)?.error;

  return (
    <div>
      <div className="flex max-w-md items-center justify-between">
        <StatusIcon
          {...info}
          Icon={UploadCloudIcon}
          isLoading={isStoringInfo}
        />
        <StatusSeparator
          className={cn(info.isSuccess && "border-axis-green")}
        />
        <StatusIcon
          {...keypair}
          Icon={keypair.isSuccess ? LockIcon : UnlockIcon}
          isLoading={isMakingKeys}
        />
        <StatusSeparator
          className={cn(keypair.isSuccess && "border-axis-green")}
        />
        <StatusIcon {...tx} Icon={BoxIcon} isLoading={isSigningTx} />
        <StatusSeparator className={cn(tx.isSuccess && "border-axis-green")} />
        <StatusIcon
          {...txReceipt}
          Icon={RadioTowerIcon}
          isLoading={isTxConfirming}
        />
      </div>
      <div className="mt-8 flex justify-center">
        {isIdle && !error && <p className="text-center">Confirm creation</p>}
        {!error && (
          <p className="text-center">
            {isStoringInfo && "Storing auction metadata on IPFS"}
            {isMakingKeys && "Generating a new keypair for secure encryption"}
            {isSigningTx && "Sign the transaction to proceed"}
            {isTxConfirming &&
              "Waiting for the transaction to be included in a block"}
            {txReceipt.isSuccess && "Auction created!"}
          </p>
        )}

        {error && (
          <p className="text-destructive text-center">
            {"Execution failed!"} <br />
            {info.isError && "Failed to store info on ipfs"}
            {keypair.isError && "Failed to generate a keypair"}
            {`${error?.name ?? ""} ${
              error instanceof BaseError ? error.shortMessage : error.message
            }`}
          </p>
        )}
      </div>
      {(isTxConfirming || txReceipt.isSuccess) && (
        <p className="mt-4 text-center ">
          View transaction on{" "}
          <BlockExplorerLink showName hash={tx.data} chainId={chainId} />
        </p>
      )}
      <div className="mt-4 flex justify-center">
        <Form {...form}>
          {(isIdle || error) && (
            <Button onSubmit={onSubmit}>{error ? "RETRY" : "DEPLOY"}</Button>
          )}
        </Form>
      </div>
    </div>
  );
}
