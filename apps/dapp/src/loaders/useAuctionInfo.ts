import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@repo/ipfs-api";

import { AuctionInfo } from "src/types";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4000",
    }),
  ],
});

export async function storeAuctionInfo(auctionInfo: AuctionInfo) {
  const response = await trpc.storeAuctionInfo.mutate(auctionInfo);

  return response;
}

export async function getAuctionInfo(hash: string) {
  const response = await trpc.getAuctionInfo.query(hash);

  return response as AuctionInfo;
}
