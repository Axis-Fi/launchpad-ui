import { useEffect } from "react";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSimulateContract,
} from "wagmi";

export type UseAllowanceProps = {
  tokenAddress?: Address;
  chainId?: number;
  decimals?: number;
  ownerAddress?: Address;
  spenderAddress?: Address;
  amount?: number | bigint;
};

/** Used to manage an address' allowance for a given token */
export const useAllowance = (args: UseAllowanceProps) => {
  const approveTx = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash: approveTx.data });

  const allowance = useReadContract({
    abi: erc20Abi,
    chainId: args.chainId,
    address: args.tokenAddress!,
    functionName: "allowance",
    args: [args.ownerAddress as Address, args.spenderAddress as Address],
    query: {
      enabled: [
        args.chainId,
        args.tokenAddress,
        args.spenderAddress,
        args.ownerAddress,
      ].every(Boolean),
    },
  });

  const amountToApprove =
    typeof args.amount === "bigint"
      ? args.amount
      : args.amount && args.decimals
        ? parseUnits(args.amount.toString(), args.decimals)
        : 0n;

  const { data: approveCall } = useSimulateContract({
    abi: erc20Abi,
    address: args.tokenAddress!,
    functionName: "approve",
    args: [args.spenderAddress!, amountToApprove],
  });

  const execute = () => approveTx.writeContract(approveCall!.request);

  useEffect(() => {
    if (approveReceipt.isSuccess) {
      allowance.refetch();
    }
  }, [allowance.refetch, approveReceipt.isSuccess]);

  const currentAllowance = allowance.data ?? 0n;

  return {
    approveTx,
    approveReceipt,
    allowance,
    execute,
    currentAllowance,
    isSufficientAllowance: currentAllowance >= amountToApprove,
    formattedAllowance: formatUnits(currentAllowance, args.decimals ?? 18),
    isLoading: allowance.isLoading,
  };
};
