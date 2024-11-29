import * as v from "valibot";
import { schema } from "./schema";

type SealedBidAuctionModuleSchema = typeof schema;
type SealedBidAuctionModule = v.InferInput<SealedBidAuctionModuleSchema>;

export type { SealedBidAuctionModule, SealedBidAuctionModuleSchema };
