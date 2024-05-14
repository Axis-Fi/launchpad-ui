import * as v from "valibot";
import { AuctionType } from "@repo/types";

const GetAuctionParamsSchema = v.object({
  lotId: v.number(),
  chainId: v.number(), // TODO: limit to deployment chainIds?
  auctionType: v.enum_(AuctionType),
});

const GetAuctionTokenDecimalsParamsSchema = GetAuctionParamsSchema;

export { GetAuctionParamsSchema, GetAuctionTokenDecimalsParamsSchema };
