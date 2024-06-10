import { Address } from "@repo/types";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { linearVestingAbi } from "@repo/abis/src/abis/generated";

export function useVestingRedeem({
  vestingTokenId,
  chainId,
  derivativeModuleAddress,
}: {
  vestingTokenId?: bigint;
  chainId?: number;
  derivativeModuleAddress?: Address;
}) {
  const redeemCall = useSimulateContract({
    abi: linearVestingAbi,
    address: derivativeModuleAddress,
    chainId: chainId,
    functionName: "redeemMax",
    args: [vestingTokenId || 0n],
    query: { enabled: !!derivativeModuleAddress && !!vestingTokenId },
  });

  const redeemTx = useWriteContract();
  const redeemReceipt = useWaitForTransactionReceipt({ hash: redeemTx.data });

  const handleRedeem = () => {
    if (redeemCall.data) {
      redeemTx.writeContract(redeemCall.data.request!);
    }
  };

  const handleRedeemSelected = () => {
    if (!derivativeModuleAddress) {
      throw new Error("No derivative module address");
    }

    if (!vestingTokenId) {
      throw new Error("No vesting token id");
    }

    redeemTx.writeContract({
      abi: linearVestingAbi,
      address: derivativeModuleAddress,
      chainId: chainId,
      functionName: "redeemMax",
      args: [vestingTokenId],
    });
  };

  return {
    handleRedeem,
    handleRedeemSelected,
    redeemCall,
    redeemReceipt,
    redeemTx,
  };
}
