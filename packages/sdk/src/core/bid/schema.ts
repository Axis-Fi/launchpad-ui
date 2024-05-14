import { Address } from "abitype";
import * as v from "valibot";
import { AuctionType } from "@repo/types";

// TODO: hoist to top/common area
const AddressSchema = v.special<Address>(
  (value) => typeof value === "string" && /0x[a-fA-F0-9]{40}$/.test(value),
);

const BidParamsSchema = v.object({
  lotId: v.number(),
  amountIn: v.number(),
  amountOut: v.number(),
  chainId: v.number(),
  auctionType: v.enum_(AuctionType),
  bidderAddress: AddressSchema,
  referrerAddress: AddressSchema,
  signedPermit2Approval: v.optional(v.string()),
});

export { AddressSchema, BidParamsSchema };
