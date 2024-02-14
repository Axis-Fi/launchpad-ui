import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { auctionInfoType, getData, storeData } from "./ipfs";

// Create express context
const createContext = ({
  /* eslint-disable-next-line */
  req,
  /* eslint-disable-next-line */
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getAuctionInfo: t.procedure
    .input(
      z.object({
        hash: z.string(),
      }),
    )
    .output(auctionInfoType)
    .query(async (opts) => {
      const { input } = opts;
      console.log("Fetching IPFS hash:", input.hash);

      // Retrieve the object from IPFS
      const response = await getData(input.hash);

      return response;
    }),
  storeAuctionInfo: t.procedure
    .input(auctionInfoType)
    .output(
      z.object({
        hash: z.string(),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts;

      // Store the object in IPFS
      const ipfsHash = await storeData(input);
      console.log("Stored object at IPFS hash:", ipfsHash);

      return {
        hash: ipfsHash,
      };
    }),
});

export const context = createContext;
