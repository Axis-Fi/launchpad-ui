import * as v from "valibot";
import { AuctionType } from "@repo/types";

const GetAuctionParamsSchema = v.object({
  lotId: v.number(),
  chainId: v.number(),
  auctionType: v.optional(v.enum_(AuctionType)),
});

const GetAuctionTokenDecimalsParamsSchema = GetAuctionParamsSchema;

export { GetAuctionParamsSchema, GetAuctionTokenDecimalsParamsSchema };
