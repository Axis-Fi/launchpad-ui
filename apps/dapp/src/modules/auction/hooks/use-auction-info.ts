import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/ipfs-api";

import { ipfsServers, environment } from "@repo/env";
import type { AuctionInfoWriteType } from "@repo/ipfs-api/src/types";

const { url: serverUrl } =
  ipfsServers[environment.current] ?? ipfsServers.staging;

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${serverUrl}/trpc`,
    }),
  ],
});

export async function storeAuctionInfo(auctionInfo: AuctionInfoWriteType) {
  const response = await trpc.storeAuctionInfo.mutate(auctionInfo);

  return response.hash;
}
