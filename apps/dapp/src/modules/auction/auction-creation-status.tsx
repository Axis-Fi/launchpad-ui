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
import { Button, Tooltip, cn } from "@repo/ui";
import { BlockExplorerLink } from "components/blockexplorer-link";
import { CreateAuctionForm } from "pages/create-auction-page";
import { Address, BaseError } from "viem";

type CreateAuctionStatusCardProps = {
  approveTx: UseWriteContractReturnType;
  approveReceipt: UseWaitForTransactionReceiptReturnType;
  info: UseMutationResult<string, Error, CreateAuctionForm>;
  keypair: UseMutationResult<Address, Error, void, unknown>;
  tx: UseWriteContractReturnType;
  txReceipt: UseWaitForTransactionReceiptReturnType;
  chainId: number;
  onSubmit: () => void;
  onSuccess: (lotId?: number | undefined) => void;
  lotId?: number | null;
};

/** Displays the status, confirmations and errors of the
 * several steps that occur when submitting an auction for creation */
export function AuctionCreationStatus({
  approveTx,
  approveReceipt,
  info,
  keypair,
  tx,
  txReceipt,
  chainId,
  onSubmit,
  ...props
}: CreateAuctionStatusCardProps) {
  const isSigningApprove = !approveTx.isIdle && approveTx.isPending;
  const { isLoading: isApprovalConfirming } = approveReceipt;

  const isStoringInfo = !info.isIdle && info.isPending;
  const isMakingKeys = !keypair.isIdle && keypair.isPending;
  const isSigningTx = !tx.isIdle && tx.isPending;
  const { isLoading: isTxConfirming, isSuccess } = txReceipt;

  const isIdle = [
    isSigningApprove,
    isApprovalConfirming,
    isStoringInfo,
    isMakingKeys,
    isSigningTx,
    isTxConfirming,
    isSuccess,
  ].every((is) => !is);

  const queries = [approveTx, approveReceipt, info, keypair, tx, txReceipt];
  const error = queries.find((m) => m.isError)?.error;
  const handleSubmit = () => {
    if (error) {
      approveTx.reset();
      info.reset();
      keypair.reset();
      tx.reset();
    }

    onSubmit();
  };

  return (
    <div>
      <div className="flex max-w-md items-center justify-between transition-all">
        <StatusIcon
          {...approveTx}
          Icon={BoxIcon}
          isLoading={isSigningApprove}
        />
        <StatusSeparator
          className={cn(approveTx.isSuccess && "border-axis-green")}
        />
        <StatusIcon
          {...approveReceipt}
          Icon={RadioTowerIcon}
          isLoading={isApprovalConfirming}
        />
        <div className="border-foreground mx-2 h-8 border-l-2" />
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
        {isIdle && !error && (
          <p className="text-center">
            {approveReceipt.isSuccess
              ? "Deploy your Auction"
              : "Approve the configured capacity"}
          </p>
        )}
        {!error && (
          <p className="text-center">
            {isStoringInfo && "Storing auction metadata on IPFS"}
            {isMakingKeys && "Generating a new keypair for secure encryption"}
            {(isSigningTx || isSigningApprove) &&
              "Sign the transaction to proceed"}
            {(isTxConfirming || isApprovalConfirming) &&
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
      {txReceipt.isSuccess && (
        <div className="flex justify-center">
          <Tooltip content={!props.lotId ? "Waiting to get Auction Id..." : ""}>
            <Button
              disabled={!props.lotId}
              onClick={() => props.onSuccess()}
              className="mt-3"
            >
              View your Auction
            </Button>
          </Tooltip>
        </div>
      )}
      {(isTxConfirming || txReceipt.isSuccess) && (
        <p className="mt-4 text-center ">
          View transaction on{" "}
          <BlockExplorerLink showName hash={tx.data} chainId={chainId} />
        </p>
      )}
      <div className="mt-4 flex justify-center">
        {(isIdle || error) && (
          <Button onClick={handleSubmit}>
            {error ? "RETRY" : approveTx.isIdle ? "APPROVE" : "DEPLOY"}
          </Button>
        )}
      </div>
    </div>
  );
}
