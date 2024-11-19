import { AuctionType } from "@repo/types";
import * as v from "valibot";
import { AddressSchema } from "../schema";

const schema = v.object({
  lotId: v.number(),
  numBids: v.number(),
  chainId: v.number(),
  callbackData: AddressSchema,
  auctionType: v.optional(v.enum_(AuctionType)),
});

export { schema };
