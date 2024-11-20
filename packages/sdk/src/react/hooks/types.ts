import {
  type UseWriteContractReturnType,
  type UseWaitForTransactionReceiptReturnType,
  type UseSimulateContractReturnType,
} from "wagmi";
import type { ContractFunctionName } from "viem";
import type { BatchAuctionHouseAbi } from "@repo/abis";

type AxisFunctionName = ContractFunctionName<
  BatchAuctionHouseAbi,
  "nonpayable" | "payable"
>;

type AxisTransaction<TFunctionName extends AxisFunctionName> = {
  submit: () => void;
  simulation: UseSimulateContractReturnType<
    BatchAuctionHouseAbi,
    TFunctionName
  >;
  transaction: UseWriteContractReturnType;
  receipt: UseWaitForTransactionReceiptReturnType;
  isWaiting: boolean;
  error:
    | UseSimulateContractReturnType["error"]
    | UseWriteContractReturnType["error"]
    | UseWaitForTransactionReceiptReturnType["error"]
    | Error
    | undefined;
};

export type { AxisTransaction, AxisFunctionName };
