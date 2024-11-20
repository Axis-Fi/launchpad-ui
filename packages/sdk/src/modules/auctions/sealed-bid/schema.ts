import * as v from "valibot";
import { AuctionType } from "@repo/types";

const schema = v.object({
  type: v.literal(AuctionType.SEALED_BID),
  minFillPercent: v.number(),
  minBidSize: v.bigint(),
  minPrice: v.bigint(),
  publicKey: v.object({
    x: v.bigint(),
    y: v.bigint(),
  }),
});

export { schema };
