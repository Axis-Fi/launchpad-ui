import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { z } from "zod";
import { getData, storeData } from "./fleek";
import { auctionInfoType } from "./types";

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
        hash: z.string().regex(/^(Qm)?[0-9a-zA-Z]{44}$/), //Multihash format
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
    .mutation(async (opts) => {
      const { input } = opts;

      // Store the object in IPFS
      const ipfsHash = await storeData({ key: "test", data: input });
      console.log("Stored object at IPFS hash:", ipfsHash);

      return {
        hash: ipfsHash,
      };
    }),
});

export const context = createContext;
