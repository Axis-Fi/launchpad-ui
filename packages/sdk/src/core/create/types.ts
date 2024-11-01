import * as v from "valibot";
import { abis } from "@repo/abis";
import { schema } from ".";
import type { ContractConfig } from "../../types";
import { AucitonMetadataSchema } from "./schema";

type CreateParams = v.InferInput<typeof schema>;
type CreateConfig = ContractConfig<typeof abis.batchAuctionHouse, "auction">;
type AuctionMetadata = v.InferInput<typeof AucitonMetadataSchema>;

export type { CreateParams, CreateConfig, AuctionMetadata };
