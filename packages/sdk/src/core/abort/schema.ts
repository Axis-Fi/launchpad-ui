import { AuctionType } from "@repo/types";
import * as v from "valibot";

const schema = v.object({
  lotId: v.number(),
  chainId: v.number(),
  auctionType: v.enum_(AuctionType),
});

export default schema;
