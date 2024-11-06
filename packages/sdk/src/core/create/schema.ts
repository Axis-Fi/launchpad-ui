import * as v from "valibot";
import type { Hex } from "viem";
import { AddressSchema, BytesSchema } from "../schema";
import { schema as fixedPriceSchema } from "../../modules/auctions/fixed-price/schema";
import { schema as sealedBidSchema } from "../../modules/auctions/sealed-bid/schema";

const Bytes5Schema = v.custom<Hex>((input: unknown): boolean =>
  typeof input === "string" ? /^0x[a-fA-F0-9]*$/.test(input) : false,
);

export const AucitonMetadataSchema = v.object({
  name: v.string(),
  description: v.string(),
  tagline: v.string(),
  links: v.object({
    projectLogo: v.pipe(v.string(), v.url()),
    payoutTokenLogo: v.pipe(v.string(), v.url()),
    projectBanner: v.pipe(v.string(), v.url()),
    website: v.pipe(v.string(), v.url()),
    twitter: v.optional(v.pipe(v.string(), v.url())),
    discord: v.optional(v.pipe(v.string(), v.url())),
    farcaster: v.optional(v.pipe(v.string(), v.url())),
  }),
});

const CommonAuctionSchema = v.object({
  curator: AddressSchema,
  referrerFee: v.number(),
  startDate: v.date(),
  endDate: v.date(),
  isCapacityDenominatedInQuoteToken: v.optional(v.boolean()),
  capacity: v.string(),
  metadata: AucitonMetadataSchema,
});

const schema = v.object({
  chainId: v.number(),
  auction: v.variant("type", [
    v.object({
      ...CommonAuctionSchema.entries,
      ...sealedBidSchema.entries,
    }),
    v.object({
      ...CommonAuctionSchema.entries,
      ...fixedPriceSchema.entries,
    }),
  ]),
  tokens: v.object({
    base: v.object({
      address: AddressSchema,
      decimals: v.number(),
    }),
    quote: v.object({
      address: AddressSchema,
      decimals: v.number(),
    }),
  }),
  // TODO: handle specific callback modules like we did auction modules
  callback: v.object({
    address: AddressSchema,
    data: BytesSchema,
  }),
  // TODO: handle specific derivative modules like we did auction modules
  derivative: v.object({
    type: Bytes5Schema,
    params: BytesSchema,
    wrap: v.boolean(),
  }),
});

export default schema;
