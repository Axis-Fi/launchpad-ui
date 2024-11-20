import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from "./schema";
import type { ContractConfig } from "../../types";
import { AuctionMetadataSchema } from "./schema";

type CreateParams = v.InferInput<typeof schema>;
type CreateConfig = ContractConfig<typeof abis.batchAuctionHouse, "auction">;
type AuctionMetadata = v.InferInput<typeof AuctionMetadataSchema>;

export type { CreateParams, CreateConfig, AuctionMetadata };
