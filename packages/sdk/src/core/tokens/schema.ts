import * as v from "valibot";

const GetTokenPriceSchema = v.object({
  chainId: v.number(),
  tokenSymbol: v.string(),
});

const GetTokenPricesSchema = v.object({
  chainId: v.number(),
  tokenSymbols: v.array(v.string()),
});

export {
  GetTokenPriceSchema,
  GetTokenPricesSchema,
};
