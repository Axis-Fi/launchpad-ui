import { z } from "zod";
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "@axis-finance/curator-api";
import { ipfsServers } from "@axis-finance/env";
import { environment } from "utils/environment";
import { sdk } from "utils/sdk";

const { url: serverUrl } =
  ipfsServers[environment.current] ?? ipfsServers.staging;

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

export type CuratorProfile = {
  id: string;
  name: string;
  description: string;
  address: string;
  twitter: string;
  links: {
    twitter: string;
    banner: string;
    avatar: string;
    website?: string;
    discord?: string;
    farcaster?: string;
  };
  options?: {
    hideName?: boolean;
  };
};

export const AuctionMetadataSchema = z.object({
  key: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  allowlist: z.array(z.array(z.string())).optional(),
  links: z.record(z.string().optional()).optional(),
});

export type AuctionMetadata = z.infer<typeof AuctionMetadataSchema>;

export async function storeAuctionInfo(auctionInfo: AuctionMetadata) {
  return sdk.saveMetadata({
    id: auctionInfo?.key ?? (auctionInfo?.name ?? "unknown-") + Date.now(),
    metadata: JSON.stringify(auctionInfo),
  });
}

export async function storeCuratorProfile(curatorProfile: CuratorProfile) {
  const curatorProfilePayload = JSON.stringify(curatorProfile);

  const ipfsCid = await sdk.saveMetadata({
    id: curatorProfile.twitter,
    metadata: curatorProfilePayload,
  });

  const { signature } = await trpc.getSigningSignatureForCurator.mutate({
    curatorProfilePayload,
    ipfsCid: ipfsCid!,
  });

  return { ipfsCid, signature };
}

export async function axisTwitterFollowing() {
  return trpc.twitterFollowing.query();
}
