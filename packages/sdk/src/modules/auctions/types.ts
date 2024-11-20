import type { Hex } from "viem";
import type { CreateParams } from "../../core/create";
import type { FixedPriceAuctionModuleSchema } from "./fixed-price";
import type { SealedBidAuctionModuleSchema } from "./sealed-bid";

type AuctionModule = {
  schema: FixedPriceAuctionModuleSchema | SealedBidAuctionModuleSchema;
  getAuctionModuleParams: (params: CreateParams) => Hex;
};

export type { AuctionModule };
