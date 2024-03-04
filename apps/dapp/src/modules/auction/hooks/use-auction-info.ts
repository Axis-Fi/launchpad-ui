import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/ipfs-api";

import { AuctionInfo } from "@repo/types";
import ipfsServers from "config/ipfs-servers";
import { environment } from "config/environment";

const { url: serverUrl } =
  ipfsServers[environment.current] ?? ipfsServers.staging;

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${serverUrl}/trpc`,
    }),
  ],
});

export async function storeAuctionInfo(
  auctionInfo: AuctionInfo,
): Promise<string> {
  const response = await trpc.storeAuctionInfo.mutate(auctionInfo);

  return response.hash;
}

export async function getAuctionInfo(hash: string) {
  const response = await trpc.getAuctionInfo.query({ hash });

  return response as AuctionInfo;
}
