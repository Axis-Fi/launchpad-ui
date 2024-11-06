import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { storeData } from "./fleek";
import { AuctionMetadataSchema } from "./types";

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
  storeAuctionInfo: t.procedure
    .input(AuctionMetadataSchema)
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

export const context = createContext;
