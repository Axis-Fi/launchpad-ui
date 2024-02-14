import { axisContracts } from "@repo/contracts";
import { blastSepolia } from "viem/chains";
import { useReadContracts } from "wagmi";

export function useBids(lotId?: string, bidIds?: string[]) {
  const axisAddresses = axisContracts.addresses[blastSepolia.id]; // TODO should detect chain id
  const baseContractInput = {
    abi: axisContracts.abis.localSealedBidBatchAuction,
    address: axisAddresses.localSealedBidBatchAuction,
    functionName: "lotEncryptedBids",
  } as const;

  // Read from the LSBBA contract
  const result = useReadContracts({
    contracts:
      !bidIds || !lotId
        ? []
        : bidIds.map((bidId) => {
            return {
              ...baseContractInput,
              args: [lotId, bidId],
            };
          }),
    query: {
      enabled: !!lotId && !!bidIds,
    },
  });

  return result;
}
