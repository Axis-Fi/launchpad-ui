import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/ipfs-api";

import { ipfsServers, environment } from "@axis-finance/env";
import type { AuctionMetadata, CuratorProfile } from "@repo/ipfs-api/src/types";

const { url: serverUrl } =
  ipfsServers[environment.current] ?? ipfsServers.staging;

// @ts-expect-error TODO: appRouter mismatch
const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${serverUrl}/trpc`,
      fetch: (input, init) => {
        return fetch(input, {
          ...init,
          credentials: "include",
        });
      },
    }),
  ],
});

export async function storeAuctionInfo(auctionInfo: AuctionMetadata) {
  const response = await trpc.storeAuctionInfo.mutate(auctionInfo);

  return response.hash;
}

export async function storeCuratorProfile(curatorProfile: CuratorProfile) {
  const response = await trpc.storeCuratorProfile.mutate(curatorProfile);

  return response.hash;
}
