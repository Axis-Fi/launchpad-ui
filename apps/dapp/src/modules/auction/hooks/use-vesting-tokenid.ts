import { LinearVestingData, Token } from "@repo/types";
import { encodeAbiParameters, isAddress } from "viem";
import { useReadContract } from "wagmi";
import { linearVestingAbi } from "@repo/abis/src/abis/generated";

export function useVestingTokenId({
  linearVestingData,
  baseToken,
  derivativeModuleAddress,
}: {
  linearVestingData?: LinearVestingData;
  baseToken: Token;
  derivativeModuleAddress?: string;
}) {
  // Fetch the tokenId of the vesting token
  const response = useReadContract({
    abi: linearVestingAbi,
    address:
      derivativeModuleAddress && isAddress(derivativeModuleAddress)
        ? derivativeModuleAddress
        : undefined,
    functionName: "computeId",
    args: [
      baseToken.address, // base token
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
