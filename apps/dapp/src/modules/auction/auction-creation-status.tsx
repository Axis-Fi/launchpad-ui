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
import { TransactionErrorDialog } from "modules/transaction/transaction-error-dialog";
import { AuctionType } from "@repo/types";

type CreateAuctionStatusCardProps = {
  auctionHouseApproveTx: UseWriteContractReturnType;
  auctionHouseApproveReceipt: UseWaitForTransactionReceiptReturnType;
  callbackApproveTx: UseWriteContractReturnType;
  callbackApproveReceipt: UseWaitForTransactionReceiptReturnType;
  info: UseMutationResult<string, Error, CreateAuctionForm>;
  keypair: UseMutationResult<Address, Error, void, unknown>;
  tx: UseWriteContractReturnType;
  txReceipt: UseWaitForTransactionReceiptReturnType;
  chainId: number;
  onSubmit: () => void;
  onSuccess: (lotId?: number | undefined) => void;
  lotId?: number | null;
  auctionType: AuctionType;
  requiresCallbacksApproval: boolean;
  isSufficientAuctionHouseAllowance: boolean;
  isSufficientCallbacksAllowance: boolean;
};

/** Displays the status, confirmations and errors of the
 * several steps that occur when submitting an auction for creation */
export function AuctionCreationStatus({
  auctionHouseApproveTx,
  auctionHouseApproveReceipt,
  callbackApproveTx,
  callbackApproveReceipt,
  info,
  keypair,
  tx,
  txReceipt,
  chainId,
  auctionType,
  requiresCallbacksApproval,
  isSufficientAuctionHouseAllowance,
  isSufficientCallbacksAllowance,
  onSubmit,
  ...props
}: CreateAuctionStatusCardProps) {
  const isSigningAuctionHouseApprove =
    !auctionHouseApproveTx.isIdle && auctionHouseApproveTx.isPending;
  const { isLoading: isAuctionHouseApprovalConfirming } =
    auctionHouseApproveReceipt;

  const isSigningCallbackApprove =
    !!callbackApproveTx &&
    !callbackApproveTx.isIdle &&
    callbackApproveTx.isPending;
  const isCallbackApprovalConfirming =
    callbackApproveReceipt && callbackApproveReceipt.isLoading;

  const isStoringInfo = !info.isIdle && info.isPending;
  const isMakingKeys = !keypair.isIdle && keypair.isPending;
  const isSigningTx = !tx.isIdle && tx.isPending;
  const { isLoading: isTxConfirming, isSuccess } = txReceipt;

  const isIdle = [
    isSigningAuctionHouseApprove,
    isAuctionHouseApprovalConfirming,
    isSigningCallbackApprove,
    isCallbackApprovalConfirming,
    isStoringInfo,
    isMakingKeys,
    isSigningTx,
    isTxConfirming,
    isSuccess,
  ].every((is) => !is);

  const queries = [
    auctionHouseApproveTx,
    auctionHouseApproveReceipt,
    callbackApproveTx,
    callbackApproveReceipt,
    info,
    keypair,
    tx,
    txReceipt,
  ];
  const error = queries.find((m) => m.isError)?.error;
  const handleSubmit = () => {
    if (error) {
      auctionHouseApproveTx.reset();
      callbackApproveTx.reset();
      info.reset();
      keypair.reset();
      tx.reset();
    }

    onSubmit();
  };

  const nonContractError = keypair.isError || info.isError;

  const auctionHouseApprovalComplete =
    isSufficientAuctionHouseAllowance || auctionHouseApproveReceipt.isSuccess;
  const callbackApprovalComplete =
    isSufficientCallbacksAllowance || callbackApproveReceipt.isSuccess;

  return (
    <div>
      <div className="flex max-w-screen-md items-center justify-between transition-all">
        <StatusIcon
          {...auctionHouseApproveTx}
          Icon={BoxIcon}
          isLoading={isSigningAuctionHouseApprove}
          isSuccess={auctionHouseApprovalComplete}
          tooltip="Approve the AuctionHouse to transfer the auction capacity"
        />
        <StatusSeparator
          className={cn(
            auctionHouseApprovalComplete && "border-feedback-success",
          )}
        />
        <StatusIcon
          {...auctionHouseApproveReceipt}
          Icon={RadioTowerIcon}
          isLoading={isAuctionHouseApprovalConfirming}
          isSuccess={auctionHouseApprovalComplete}
          tooltip="Confirming the transaction to approve the AuctionHouse"
        />
        <div className="border-foreground mx-2 h-8 border-l-2" />
        {requiresCallbacksApproval && (
          <>
            <StatusIcon
              {...callbackApproveTx}
              Icon={BoxIcon}
              isLoading={isSigningCallbackApprove}
              isSuccess={callbackApprovalComplete}
              tooltip="Approve the Callback contract to transfer base token liquidity"
            />
            <StatusSeparator
              className={cn(
                callbackApprovalComplete && "border-feedback-success",
              )}
            />
            <StatusIcon
              {...callbackApproveReceipt}
              Icon={RadioTowerIcon}
              isLoading={isCallbackApprovalConfirming}
              isSuccess={callbackApprovalComplete}
              tooltip="Confirming the transaction to approve the Callback contract"
            />
            <div className="border-foreground mx-2 h-8 border-l-2" />
          </>
        )}
        <StatusIcon
          {...info}
          Icon={UploadCloudIcon}
          isLoading={isStoringInfo}
          tooltip="Storing the auction information on IPFS"
        />
        <StatusSeparator
          className={cn(info.isSuccess && "border-feedback-success")}
        />
        {auctionType === AuctionType.SEALED_BID && (
          <>
            <StatusIcon
              {...keypair}
              Icon={keypair.isSuccess ? LockIcon : UnlockIcon}
              isLoading={isMakingKeys}
              tooltip="Generating a new keypair for the auction"
            />
            <StatusSeparator
              className={cn(keypair.isSuccess && "border-feedback-success")}
            />
          </>
        )}
        <StatusIcon
          {...tx}
          Icon={BoxIcon}
          isLoading={isSigningTx}
          tooltip="Signing the transaction to create the auction"
        />
        <StatusSeparator
          className={cn(tx.isSuccess && "border-feedback-success")}
        />
        <StatusIcon
          {...txReceipt}
          Icon={RadioTowerIcon}
          isLoading={isTxConfirming}
          tooltip="Confirming the transaction to create the auction"
        />
      </div>
      <div className="mt-8 flex justify-center">
        {isIdle && !error && (
          <p className="text-center">
            {!auctionHouseApprovalComplete
              ? "Approve the capacity for the AuctionHouse"
              : requiresCallbacksApproval && !callbackApprovalComplete
                ? "Approve the capacity for the Callbacks contract"
                : "Deploy your Auction"}
          </p>
        )}
        {!error && (
          <p className="text-center">
            {isStoringInfo && "Storing auction metadata on IPFS"}
            {isMakingKeys && "Generating a new keypair for secure encryption"}
            {(isSigningTx ||
              isSigningAuctionHouseApprove ||
              isSigningCallbackApprove) &&
              "Sign the transaction to proceed"}
            {(isTxConfirming ||
              isAuctionHouseApprovalConfirming ||
              isCallbackApprovalConfirming) &&
              "Waiting for the transaction to be included in a block"}
            {txReceipt.isSuccess && "Auction created!"}
          </p>
        )}

        {error && (
          <p className="text-center">
            {info.isError && "Failed to store info on ipfs"}
            {keypair.isError && "Failed to generate a keypair"}
            {error && !nonContractError && (
              <TransactionErrorDialog error={error} />
            )}
            {nonContractError &&
              `${error?.name ?? ""} ${
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
            {error
              ? "RETRY"
              : !auctionHouseApprovalComplete || !callbackApprovalComplete
                ? "APPROVE"
                : "DEPLOY"}
          </Button>
        )}
      </div>
    </div>
  );
}
