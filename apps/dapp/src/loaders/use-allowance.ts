import { useEffect } from "react";
import { Address, erc20Abi, formatUnits, parseUnits } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export type UseAllowanceProps = {
  tokenAddress?: Address;
  chainId?: number;
  decimals?: number;
  ownerAddress?: Address;
  spenderAddress?: Address;
  amount?: number;
};

export const useAllowance = (args: UseAllowanceProps) => {
  const { data: hash, writeContract, ...approveRequest } = useWriteContract();
  const approveReceipt = useWaitForTransactionReceipt({ hash });

  const allowance = useReadContract({
    abi: erc20Abi,
    chainId: args.chainId,
    address: args.tokenAddress,
    functionName: "allowance",
    args: [args.ownerAddress as Address, args.spenderAddress as Address],
    query: {
      enabled:
        !!args.chainId &&
        !!args.tokenAddress &&
        !!args.spenderAddress &&
        !!args.ownerAddress,
    },
  });

  const amountToApprove =
    args.amount && args.decimals
      ? parseUnits(args.amount.toString(), args.decimals)
      : 0n;

  const execute = () => {
    writeContract({
      abi: erc20Abi,
      address: args.tokenAddress!,
      functionName: "approve",
      args: [args.spenderAddress!, amountToApprove],
    });
  };

  useEffect(() => {
    if (approveReceipt.isSuccess) {
      allowance.refetch();
    }
  }, [allowance.refetch, approveReceipt.isSuccess]);

  const currentAllowance = allowance.data ?? 0n;

  return {
    approveRequest,
    approveReceipt,
    allowance,
    execute,
    currentAllowance,
    isSufficientAllowance: currentAllowance >= amountToApprove,
    formattedAllowance: formatUnits(currentAllowance, args.decimals ?? 18),
    isLoading: allowance.isLoading,
  };
};
