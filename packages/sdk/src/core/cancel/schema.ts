import * as v from "valibot";
import { BytesSchema } from "../schema";
import { AuctionType } from "@repo/types";

const schema = v.object({
  chainId: v.number(),
  lotId: v.number(),
  auctionType: v.optional(v.enum_(AuctionType)),
  callback: v.optional(BytesSchema),
});

export { schema };
