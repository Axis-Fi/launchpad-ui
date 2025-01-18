import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/ipfs-api";

import { ipfsServers } from "@axis-finance/env";
import type { AuctionMetadata, CuratorProfile } from "@repo/ipfs-api/src/types";
import { environment } from "utils/environment";

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
  return trpc.storeAuctionInfo.mutate(auctionInfo);
}

export async function storeCuratorProfile(curatorProfile: CuratorProfile) {
  return trpc.storeCuratorProfile.mutate(curatorProfile);
}

export async function axisTwitterFollowing() {
  return trpc.axisFollowing.query();
}
