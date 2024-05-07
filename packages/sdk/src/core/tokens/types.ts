import * as v from "valibot";
import {
  GetTokenPriceSchema,
  GetTokenPricesSchema,
} from "./schema";

type GetTokenPriceParams = v.Input<typeof GetTokenPriceSchema>;
type GetTokenPricesParams = v.Input<typeof GetTokenPricesSchema>;

export type {
  GetTokenPriceParams,
  GetTokenPricesParams,
};
