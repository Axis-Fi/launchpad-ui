import { z } from "zod";

export const AuctionMetadataSchema = z.object({
  key: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  allowlist: z.array(z.array(z.string())).optional(),
  links: z.record(z.string().optional()).optional(),
});

export type AuctionMetadata = z.infer<typeof AuctionMetadataSchema>;

export const CuratorProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  address: z.string(),
  twitter: z.string().optional(),
  links: z.object({
    banner: z.string().url(),
    avatar: z.string().url(),
    website: z.string().url().optional(),
    discord: z.string().url().optional(),
    farcaster: z.string().url().optional(),
  }),
  options: z
    .object({
      hideName: z.boolean().optional(),
    })
    .optional(),
});

export type CuratorProfile = z.infer<typeof CuratorProfileSchema>;
