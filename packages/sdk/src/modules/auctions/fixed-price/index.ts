import { schema } from "./schema";
import { getAuctionModuleParams } from "./module";
import type { AuctionModule } from "../types";

export type { FixedPriceAuctionModuleSchema } from "./types";

const module = {
  schema: schema,
  getAuctionModuleParams,
} satisfies AuctionModule;

export default module;
