import * as v from "valibot";
import type { Address } from "abitype";
import { abis } from "@repo/abis";
import type { EncryptLotIdPost200Response } from "@repo/cloak";
import { BidParamsSchema } from "./schema";
import type { ContractConfig } from "../../types";

type BidParams = v.Input<typeof BidParamsSchema>;
type BidConfig = ContractConfig<typeof abis.auctionHouse, "bid">;

type GetBidConfigParams = Pick<
  BidParams,
  "lotId" | "amountIn" | "referrerAddress"
> & {
  auctionHouseAddress: Address;
  quoteTokenDecimals: number;
  encryptedBid: EncryptLotIdPost200Response;
};

type EncryptBidParams = BidParams & {
  quoteTokenDecimals: number;
  baseTokenDecimals: number;
  auctionHouseAddress: Address;
};

export type { GetBidConfigParams, BidParams, BidConfig, EncryptBidParams };
