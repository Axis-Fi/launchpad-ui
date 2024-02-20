import { BlockExplorerLink } from "components/blockexplorer-link";
import { TransactionErrorDialog } from "./transaction-error-dialog";
import { MutationDialogElementProps } from "./mutation-dialog";

export function TransactionHashCard(
  props: {
    message?: string;
  } & MutationDialogElementProps,
) {
  return (
    <div className="flex w-full max-w-lg flex-col text-center">
      {props.error && <TransactionErrorDialog error={props.error} />}
      {props.message && <h3>{props.message}</h3>}
      <div className="mt-4 flex justify-center">
        View transaction on&nbsp;
        {props.hash && props.chainId ? (
          <BlockExplorerLink
            showName
            address={props.hash}
            chainId={props.chainId}
          />
        ) : (
          "Unable to generate explorer link"
        )}
      </div>
    </div>
  );
}
