import { Button } from "@repo/ui";
import { cloakClient } from "src/services/cloak";
import type { AuctionCreated } from "@repo/subgraph-client";
import { useMutation } from "@tanstack/react-query";
import { usePublicClient, useWalletClient } from "wagmi";
import { simulateContract } from "viem/actions";

export function AuctionConcluded({ auction }: { auction: AuctionCreated }) {
  const { data: client } = useWalletClient();
  const publicClient = usePublicClient();

  const decryptLot = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error("wallet must be connected");

      const bids = await cloakClient.keysApi.decryptsLotIdGet({
        //@ts-expect-error file is WIP
        xChainId: auction.chainId,
        xAuctionHouse: "0x",
        lotId: Number(auction.lotId),
      });

      if (!bids.length) throw new Error("Unable to find bids");

      const request = await simulateContract(client, {
        address: "0x",
        //@ts-expect-error file is WIP
        abi: null,
        functionName: "<TODO>",
      });

      //@ts-expect-error file is WIP
      const hash = await client.writeContract(request);

      return publicClient?.waitForTransactionReceipt({ hash });
    },
  });

  return (
    <div className="flex justify-center">
      <Button onClick={() => decryptLot.mutate}>Decrypt Bids</Button>
    </div>
  );
}
