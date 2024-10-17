import * as v from "valibot";
import { AuctionType } from "@repo/types";
import { AddressSchema } from "../schema";

const BidParamsSchema = v.object({
  lotId: v.number(),
  amountIn: v.bigint(),
  amountOut: v.bigint(),
  chainId: v.number(),
  auctionType: v.enum_(AuctionType),
  bidderAddress: AddressSchema,
  referrerAddress: AddressSchema,
  signedPermit2Approval: v.optional(v.string()),
});

export { AddressSchema, BidParamsSchema };
