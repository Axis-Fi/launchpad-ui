import { Address, erc20Abi, parseUnits } from "viem";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";

export type UseAllowanceProps = {
  tokenAddress: Address;
  chainId: number;
  decimals: number;
  ownerAddress: Address;
  spenderAddress: Address;
  amount: number;
};

export const useAllowance = (args: UseAllowanceProps) => {
  const { data: hash, ...approve } = useWriteContract();
  const tx = useWaitForTransactionReceipt({ hash });

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

  const amountToApprove = args.amount
    ? parseUnits(args.amount.toString(), args.decimals)
    : 0n;

  const execute = () => {
    approve.writeContract({
      abi: erc20Abi,
      address: args.tokenAddress,
      functionName: "approve",
      args: [args.spenderAddress, amountToApprove],
    });
  };

  return {
    approve,
    approveTx: tx,
    execute,
    allowance,
    currentAllowance: allowance.data,
  };
};
