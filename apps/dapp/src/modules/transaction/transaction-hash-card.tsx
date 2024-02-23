import { BlockExplorerLink } from "components/blockexplorer-link";
import { TransactionErrorDialog } from "./transaction-error-dialog";
import { TransactionDialogElementProps } from "./transaction-dialog";
import { LoadingIndicator } from "modules/app/loading-indicator";

export function TransactionHashCard(
  props: {
    message?: string;
  } & TransactionDialogElementProps,
) {
  const message = "Waiting for the transaction to finalize...";
  return (
    <div className="flex w-full max-w-lg flex-col text-center">
      {props.error && <TransactionErrorDialog error={props.error} />}
      {props.message ? (
        <h3>{props.message}</h3>
      ) : (
        <div className="flex w-full items-center justify-center gap-x-1">
          {message} <LoadingIndicator className="fill-foreground size-4" />{" "}
        </div>
      )}
      <div className="mt-4 flex justify-center">
        View transaction on&nbsp;
        {props.hash && props.chainId ? (
          <BlockExplorerLink
            showName
            hash={props.hash}
            chainId={props.chainId}
          />
        ) : (
          "Unable to generate explorer link"
        )}
      </div>
    </div>
  );
}
