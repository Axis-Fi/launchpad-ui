import { Button } from "@repo/ui";
import { cloakClient } from "src/services/cloak";
import { useMutation } from "@tanstack/react-query";
import { usePublicClient, useWalletClient } from "wagmi";
import { simulateContract } from "viem/actions";
import type { Auction } from "src/types";
import { axisContracts } from "@repo/contracts";

export function AuctionConcluded({ auction }: { auction: Auction }) {
  const { data: client } = useWalletClient();
  const publicClient = usePublicClient();

  const contracts = axisContracts[auction.chainId];

  const decryptLot = useMutation({
    mutationFn: async () => {
      if (!client) throw new Error("Wallet must be connected");

      const bids = await cloakClient.keysApi.decryptsLotIdGet({
        xAuctionHouse: contracts.auctionHouse.address,
        xChainId: auction.chainId,
        lotId: Number(auction.lotId),
      });

      if (!bids.length) throw new Error("Unable to find bids");

      const request = await simulateContract(client, {
        address: contracts.auctionHouse.address,
        //@ts-expect-error abi is blank
        abi: contracts.auctionHouse.address,
        functionName: "bid",
      });

      //@ts-expect-error file is WIP
      const hash = await client.writeContract(request);

      return publicClient?.waitForTransactionReceipt({ hash });
    },
  });

  return (
    <div className="flex justify-center">
      <Button onClick={() => decryptLot.mutate}>Decrypt Bids</Button>
      {decryptLot.isPending && <p>Pending ... </p>}
      {decryptLot.isSuccess && <p>Bids decrypted!</p>}
    </div>
  );
}
