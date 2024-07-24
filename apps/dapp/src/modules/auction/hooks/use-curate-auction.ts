import { AuctionType } from "@repo/types";
import { getAuctionHouse } from "utils/contracts";
import { toHex } from "viem";
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

export function useCurateAuction(
  lotId: string,
  chainId: number,
  auctionType: AuctionType,
) {
  const auctionHouse = getAuctionHouse({ chainId, auctionType });

  const { data: curateCall } = useSimulateContract({
    abi: auctionHouse.abi,
    address: auctionHouse.address,
    chainId,
    functionName: "curate",
    args: [BigInt(lotId), toHex("0x")], //TODO: Add support for callback
  });

  const curateTx = useWriteContract();
  const curateReceipt = useWaitForTransactionReceipt({ hash: curateTx.data });

  const handleCurate = () => curateTx.writeContract(curateCall!.request);

  return {
    curateTx,
    curateReceipt,
    handleCurate,
  };
}
