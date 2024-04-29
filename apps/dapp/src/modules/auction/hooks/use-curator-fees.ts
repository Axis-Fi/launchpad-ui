import {
  useAccount,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { toKeycode } from "utils/hex";
import { AuctionType } from "@repo/types";
import { toBasisPoints } from "utils/number";
import { getAuctionHouse } from "utils/contracts";

export function useCuratorFees(
  chainId: number,
  feePercentage: number,
  auctionType: AuctionType,
) {
  const { address } = useAccount();
  const auctionHouse = getAuctionHouse({ chainId, auctionType });

  const currentFee = 0; //TODO: Figure out to fetch current curator fee
  const newFee = toBasisPoints(feePercentage!); // Fees are in basis points

  const { data: setFeeCall, ...feeSimulation } = useSimulateContract({
    chainId,
    abi: auctionHouse.abi,
    address: auctionHouse.address,
    functionName: "setCuratorFee",
    //TODO: add support for different auctions
    args: [toKeycode(AuctionType.SEALED_BID), newFee],
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
