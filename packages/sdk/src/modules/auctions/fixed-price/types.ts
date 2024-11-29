import * as v from "valibot";
import { schema } from "./schema";

type FixedPriceAuctionModuleSchema = typeof schema;
type FixedPriceAuctionModule = v.InferInput<FixedPriceAuctionModuleSchema>;

export type { FixedPriceAuctionModule, FixedPriceAuctionModuleSchema };
