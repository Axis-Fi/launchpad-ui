import type { AuctionModule } from "../types";
import { schema } from "./schema";
import { getAuctionModuleParams } from "./module";

export type { SealedBidAuctionModuleSchema } from "./types";

const module: AuctionModule = {
  schema: schema,
  getAuctionModuleParams,
};

export default module;
