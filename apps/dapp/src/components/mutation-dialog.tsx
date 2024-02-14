import { type UseMutationResult } from "@tanstack/react-query";
import { UseWriteContractReturnType } from "wagmi";

type MutationDialogProps = {
  mutation: UseMutationResult | UseWriteContractReturnType;
};

export function MutationDialog(props: MutationDialogProps) {
  props;
  return <div />;
}
