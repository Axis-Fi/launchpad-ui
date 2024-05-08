import * as v from "valibot";
import { AddressSchema } from "../bid/schema";

const GetTokenPriceSchema = v.object({
  token: v.object({
    chainId: v.number(),
    address: AddressSchema,
    symbol: v.string(),
    decimals: v.number(),
    name: v.string(),
    totalSupply: v.optional(v.number()),
    logoURI: v.optional(v.string()),
    mintable: v.optional(v.boolean()),
  }),
});

const GetTokenPricesSchema = v.object({
  tokens: v.array(GetTokenPriceSchema),
});

export { GetTokenPriceSchema, GetTokenPricesSchema };
