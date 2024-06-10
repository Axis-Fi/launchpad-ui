import { PropsWithAuction } from "@repo/types";
import { useDerivativeModule } from "./use-derivative-module";
import { useDerivativeData } from "./use-derivative-data";
import { encodeAbiParameters, isAddress } from "viem";
import { useReadContract } from "wagmi";
import { linearVestingAbi } from "@repo/abis/src/abis/generated";

export function useVestingTokenId({ auction }: PropsWithAuction) {
  // Get the address of the derivative module
  const { data: derivativeModuleAddress } = useDerivativeModule({
    lotId: auction.lotId,
    chainId: auction.chainId,
    auctionType: auction.auctionType,
  });

  // Get the derivative data
  const { data: linearVestingData } = useDerivativeData({
    lotId: auction.lotId,
    chainId: auction.chainId,
    auctionType: auction.auctionType,
  });

  // Fetch the tokenId of the vesting token
  const response = useReadContract({
    abi: linearVestingAbi,
    address:
      derivativeModuleAddress && isAddress(derivativeModuleAddress)
        ? derivativeModuleAddress
        : undefined,
    functionName: "computeId",
    args: [
      auction.baseToken.address, // base token
      encodeAbiParameters(
        [
          { name: "start", type: "uint48" }, // vesting start
          { name: "end", type: "uint48" }, // vesting end
        ],
        [linearVestingData?.start ?? 0, linearVestingData?.expiry ?? 0],
      ),
    ],
    query: { enabled: !!derivativeModuleAddress && !!linearVestingData },
  });

  return {
    ...response,
    data: response.isSuccess ? response.data : undefined,
  };
}
