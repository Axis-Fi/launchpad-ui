import * as v from "valibot";
import type { Address } from "abitype";
import { abis } from "@repo/abis";
import type { Token } from "@repo/types";
import type { EncryptLotIdPost200Response } from "@repo/cloak";
import { BidParamsSchema } from "./schema";
import type { ContractConfig, SdkResult } from "../../types";

type BidParams = v.Input<typeof BidParamsSchema>;
type BidConfig = ContractConfig<typeof abis.auctionHouse, "bid">;
type BidResult = SdkResult<typeof abis.auctionHouse, "bid">;

type GetBidConfigParams = Pick<
  BidParams,
  "lotId" | "amountIn" | "referrerAddress"
> & {
  auctionHouseAddress: Address;
  quoteToken: Token;
  encryptedBid: EncryptLotIdPost200Response;
};

type EncryptBidParams = BidParams & {
  quoteToken: Token;
  baseToken: Token;
  auctionHouseAddress: Address;
};

export type {
  GetBidConfigParams,
  BidParams,
  BidConfig,
  BidResult,
  EncryptBidParams,
};
