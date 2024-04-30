import * as v from "valibot";
import type { Address } from "abitype";
import { abis } from "@repo/abis";
import type { EncryptLotIdPost200Response } from "@repo/cloak";
import * as bid from ".";
import type { ContractConfig } from "../../types";

type BidParams = v.Input<typeof bid.schema.BidParamsSchema>;
type BidConfig = ContractConfig<typeof abis.auctionHouse, "bid">;

type PrimedBidParams = Pick<
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

type BidModule = {
  schema: typeof bid.schema;
  functions: typeof bid.functions;
  abi: typeof bid.abi;
  utils: typeof bid.utils;
};

export type {
  PrimedBidParams,
  BidParams,
  BidConfig,
  EncryptBidParams,
  BidModule,
};
