import * as v from "valibot";
import { AuctionType } from "@repo/types";
import { AddressSchema, BytesSchema } from "../schema";

const BidParamsSchema = v.object({
  lotId: v.number(),
  amountIn: v.pipe(v.bigint(), v.minValue(BigInt(1))),
  amountOut: v.bigint(),
  chainId: v.number(),
  auctionType: v.enum_(AuctionType),
  bidderAddress: AddressSchema,
  referrerAddress: AddressSchema,
  signedPermit2Approval: v.optional(v.string()),
  callbackData: BytesSchema,
});

export { AddressSchema, BidParamsSchema };
