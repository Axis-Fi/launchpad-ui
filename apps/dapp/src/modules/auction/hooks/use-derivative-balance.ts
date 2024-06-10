import { linearVestingAbi } from "@repo/abis/src/abis/generated";
import { Address } from "@repo/types";
import { isAddress } from "viem";
import { useReadContract } from "wagmi";

export function useDerivativeBalance({
  account,
  tokenId,
  chainId,
  derivativeModuleAddress,
}: {
  account: Address;
  tokenId: bigint;
  chainId: number;
  derivativeModuleAddress: Address;
}) {
  const response = useReadContract({
    abi: linearVestingAbi,
    address: isAddress(derivativeModuleAddress)
      ? derivativeModuleAddress
      : undefined,
    chainId: chainId,
    functionName: "balanceOf",
    args: [account, tokenId],
    query: { enabled: !!account && !!tokenId && !!derivativeModuleAddress },
  });

  return {
    ...response,
    data: response.isSuccess ? response.data : undefined,
  };
}
