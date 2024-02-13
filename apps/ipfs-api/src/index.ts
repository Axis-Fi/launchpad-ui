import { auctionInfoType, getData, storeData } from "./ipfs";
import { publicProcedure, router, context } from "./trpc";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";

const appRouter = router({
  getAuctionInfo: publicProcedure.input(z.string()).query(async (opts) => {
    const { input } = opts;

    // Retrieve the object from IPFS
    const response = await getData(input);

    return response;
  }),
  storeAuctionInfo: publicProcedure
    .input(auctionInfoType)
    .mutation(async (opts) => {
      const { input } = opts;

      // Store the object in IPFS
      const ipfsHash = await storeData(input);

      return ipfsHash;
    }),
});

export type AppRouter = typeof appRouter;

const app = express();

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: context,
  }),
);

app.listen(4000);
