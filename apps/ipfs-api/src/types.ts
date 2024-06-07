import { z } from "zod";

export const auctionInfoType = z.object({
  key: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  allowlist: z.array(z.array(z.string())).optional(),
  links: z.record(z.string().optional()).optional(),
});
