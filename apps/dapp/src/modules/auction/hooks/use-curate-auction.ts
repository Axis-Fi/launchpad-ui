import { axisContracts } from "@repo/contracts";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useCurateAuction(lotId: string, chainId: number) {
  const axisAddresses = axisContracts.addresses[chainId];

  const { data: curateCall, error } = useSimulateContract({
    abi: axisContracts.abis.auctionHouse,
    address: axisAddresses?.auctionHouse,
    chainId,
    functionName: "curate",
    args: [BigInt(lotId)],
  });
  console.log({ error });

  const curateTx = useWriteContract();
  const curateReceipt = useWaitForTransactionReceipt({ hash: curateTx.data });

  const handleCurate = () => curateTx.writeContract(curateCall!.request);

  return {
    curateTx,
    curateReceipt,
    handleCurate,
  };
}
