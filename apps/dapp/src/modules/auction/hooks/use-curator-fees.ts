import { axisContracts } from "@repo/contracts";
import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { toKeycode } from "../utils/to-keycode";
import { AuctionTypes } from "src/types";

export function useCuratorFees(chainId: number, feePercentage?: number) {
  const { address } = useAccount({});
  const axisAddresses = axisContracts.addresses[chainId];

  const currentFee = 0; //TODO: Figure out to fetch current curator fee
  const newFee = Number(feePercentage) * 1000; // Fees are in basis points

  const { data: setFeeCall, ...feeSimulation } = useSimulateContract({
    chainId,
    abi: axisContracts.abis.auctionHouse,
    address: axisAddresses.auctionHouse,
    functionName: "setCuratorFee",
    //TODO: add support for different auctions
    args: [toKeycode(AuctionTypes.SEALED_BID), newFee],
    query: {
      enabled: !!address && !!chainId && isFinite(newFee),
    },
  });

  const feeTx = useWriteContract();
  const feeReceipt = useWaitForTransactionReceipt({ hash: feeTx.data });
  const handleSetFee = () => feeTx.writeContract(setFeeCall!.request);

  return {
    fee: currentFee,
    feeSimulation,
    feeTx,
    feeReceipt,
    handleSetFee,
  };
}
