import * as v from "valibot";
import { GetTokenPriceSchema, GetTokenPricesSchema } from "./schema";

type GetTokenPriceParams = v.InferOutput<typeof GetTokenPriceSchema>;
type GetTokenPricesParams = v.InferOutput<typeof GetTokenPricesSchema>;

export type { GetTokenPriceParams, GetTokenPricesParams };
