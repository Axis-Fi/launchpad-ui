import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { abi as wrapperAbi } from "./wrapper-abi";
import { Address } from "viem";

const address: Address = "0x4200000000000000000000000000000000000006";
const testValue = 10000000000000000n;

export default function useWrapperContract({
  contractAddress = address,
  amount = testValue,
}) {
  const { address: userAddress } = useAccount();
  //WRAPPING
  const { data: wrapData, ...wrapCall } = useSimulateContract({
    functionName: "deposit",
    value: amount,
    address: contractAddress,
    account: userAddress,
    abi: wrapperAbi,
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
  });

  const { data: unwrapHash, ...unwrapTx } = useWriteContract();
  const unwrapReceipt = useWaitForTransactionReceipt({ hash: unwrapHash });
  const unwrap = () =>
    unwrapData?.request && unwrapTx.writeContract(unwrapData.request!);

  return {
    wrap,
    wrapCall,
    wrapTx,
    wrapReceipt,

    unwrap,
    unwrapCall,
    unwrapTx,
    unwrapReceipt,
  };
}
