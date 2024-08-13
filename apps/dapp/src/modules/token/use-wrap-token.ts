import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi as wrapperAbi } from "./wrapper-abi";
import { Address } from "viem";

type UseWrapperContractArgs = {
  contractAddress?: Address;
  amount: bigint;
  isWrapping: boolean;
};

export default function useWrapperContract({
  contractAddress,
  amount,
  isWrapping,
}: UseWrapperContractArgs) {
  const { address: userAddress } = useAccount();
  //WRAPPING
  const { data: wrapData, ...wrapCall } = useSimulateContract({
    functionName: "deposit",
    value: amount,
    address: contractAddress,
    account: userAddress,
    abi: wrapperAbi,
    query: { enabled: !!contractAddress && isWrapping },
  });
  const { data: wrapHash, ...wrapTx } = useWriteContract();
  const wrapReceipt = useWaitForTransactionReceipt({ hash: wrapHash });
  const wrap = () =>
    wrapData?.request && wrapTx.writeContract(wrapData.request!);

  // UNWRAPPING
  const { data: unwrapData, ...unwrapCall } = useSimulateContract({
    functionName: "withdraw",
    args: [amount],
    address: contractAddress,
    account: userAddress,
    abi: wrapperAbi,
    query: { enabled: !!contractAddress && !isWrapping },
  });

  const { data: unwrapHash, ...unwrapTx } = useWriteContract();
  const unwrapReceipt = useWaitForTransactionReceipt({ hash: unwrapHash });
  const unwrap = () =>
    unwrapData?.request && unwrapTx.writeContract(unwrapData.request!);

  const currentHandlers = isWrapping
    ? [wrapCall, wrapTx, wrapReceipt]
    : [unwrapCall, unwrapTx, unwrapReceipt];

  return {
    wrap,
    wrapCall,
    wrapTx,
    wrapReceipt,

    unwrap,
    unwrapCall,
    unwrapTx,
    unwrapReceipt,
    currentCall: isWrapping ? wrapTx : unwrapTx,
    currentTx: isWrapping ? wrapTx : unwrapTx,
    currentReceipt: isWrapping ? wrapReceipt : unwrapReceipt,
    currentHandlers,
  };
}
