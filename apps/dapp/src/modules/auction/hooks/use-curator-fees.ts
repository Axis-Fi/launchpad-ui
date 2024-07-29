import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { toKeycode } from "utils/hex";
import { AuctionType } from "@repo/types";
import { fromBasisPoints, toBasisPoints } from "utils/number";
import { getAuctionHouse } from "utils/contracts";
import { useGetCuratorFee } from "./use-get-curator-fee";

/**Reads and sets the curator fee for an auction house*/
export function useCuratorFees(
  chainId: number,
  feePercentage: number,
  auctionType: AuctionType,
) {
  const { address, isConnected } = useAccount();
  const auctionHouse = getAuctionHouse({ chainId, auctionType });
  const keycode = toKeycode(auctionType);

  const { data: currentFee } = useGetCuratorFee(chainId, auctionType, address!);

  const newFee = toBasisPoints(feePercentage!); // Fees are in basis points

  const { data: setFeeCall, ...feeSimulation } = useSimulateContract({
    chainId,
    abi: auctionHouse.abi,
    address: auctionHouse.address,
    functionName: "setCuratorFee",
    args: [keycode, newFee],
    query: {
      enabled: isConnected && !!chainId && isFinite(newFee),
    },
  });

  const feeTx = useWriteContract();
  const feeReceipt = useWaitForTransactionReceipt({ hash: feeTx.data });
  const handleSetFee = () => feeTx.writeContract(setFeeCall!.request);
  const reset = () => feeTx.reset();

  return {
    fee: fromBasisPoints(currentFee ?? 0),
    feeSimulation,
    feeTx,
    feeReceipt,
    handleSetFee,
    //TODO: add better error handling
    isError: [feeSimulation, feeTx, feeReceipt].some((r) => r.isError),
    reset,
  };
}
