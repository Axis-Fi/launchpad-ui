import { z } from "zod";

export const auctionInfoWriteType = z.object({
  key: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  tagline: z.string().optional().nullable(),
  allowlist: z.array(z.array(z.string())).optional(),
  links: z.record(z.string().optional()).optional(),
});

export type AuctionInfoWriteType = z.infer<typeof auctionInfoWriteType>;
