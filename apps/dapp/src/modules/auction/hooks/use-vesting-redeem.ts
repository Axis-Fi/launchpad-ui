import { BatchAuction } from "@repo/types";
import { useDerivativeModule } from "./use-derivative-module";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { linearVestingAbi } from "@repo/abis/src/abis/generated";
import { useVestingTokenId } from "./use-vesting-tokenid";

export function useVestingRedeem({ auction }: { auction: BatchAuction }) {
  // Get the address of the derivative module
  const { data: derivativeModuleAddress } = useDerivativeModule({
    lotId: auction.lotId,
    chainId: auction.chainId,
    auctionType: auction.auctionType,
  });

  // Get the id of the vesting token
  const { data: vestingTokenId } = useVestingTokenId({ auction });

  const redeemCall = useSimulateContract({
    abi: linearVestingAbi,
    address: derivativeModuleAddress,
    chainId: auction.chainId,
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
      chainId: auction.chainId,
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
