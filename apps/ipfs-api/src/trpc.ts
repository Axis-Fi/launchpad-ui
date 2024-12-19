import { z } from "zod";
import type { Request, Response } from "express";
import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { storeData } from "./fleek";
import { AuctionMetadataSchema, CuratorProfileSchema } from "./types";

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

type Context = {
  req: Request;
  res: Response;
};

const t = initTRPC.context<Context>().create();

const isTwitterVerified = t.middleware(({ ctx, next }) => {
  if (!ctx.req.isAuthenticated || !ctx.req.isAuthenticated()) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource.",
    });
  }

  return next();
});

const twitterVerifiedProcedure = t.procedure.use(isTwitterVerified);

export const appRouter = t.router({
  storeAuctionInfo: t.procedure
    .input(AuctionMetadataSchema)
    .output(z.string())
    .mutation(async ({ input }) => {
      console.log("Saving auction info", input);
      const { key, ...data } = input;

      const ipfsCid = await storeData({
        key: key ?? data.name!,
        data: JSON.stringify(data),
      });

      console.log("Stored object at IPFS cid:", ipfsCid);

      return ipfsCid;
    }),

  storeCuratorProfile: twitterVerifiedProcedure
    .input(CuratorProfileSchema)
    .output(z.string())
    .mutation(async ({ input, ctx }) => {
      const userTwitter = ctx.req.user?.username;

      if (!userTwitter) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to get Twitter username from user.",
        });
      }

      console.log("Storing curator profile data:", input);

      const ipfsCid = await storeData({
        key: userTwitter,
        data: JSON.stringify({
          ...input,
          twitter: userTwitter,
          links: {
            ...input.links,
            twitter: `https://x.com/${userTwitter}`,
          },
        }),
      });

      console.log("Curator profile saved:", input);

      return ipfsCid;
    }),
});

export type AppRouter = typeof appRouter;

export const context = createContext;
