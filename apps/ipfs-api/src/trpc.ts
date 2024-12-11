import { z } from "zod";
import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { storeData } from "./fleek";
import { AuctionMetadataSchema } from "./types";

// eslint-disable-next-line no-empty-pattern
const createContext = ({}: trpcExpress.CreateExpressContextOptions) => ({});
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  storeAuctionInfo: t.procedure
    .input(AuctionMetadataSchema)
    .output(
      z.object({
        hash: z.object({
          hashV0: z.string(),
        }),
      }),
    )
    .mutation(async (opts) => {
      const {
        input: { key, ...data },
      } = opts;

      // Store the object in IPFS
      const ipfsHash = await storeData({
        key: key ?? data.name!,
        data: JSON.stringify(data),
      });

      console.log("Stored object at IPFS hash:", ipfsHash);

      return {
        hash: ipfsHash,
      };
    }),
});

export type AppRouter = typeof appRouter;

export const context = createContext;
