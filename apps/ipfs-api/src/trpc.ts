import { z } from "zod";
import { type Address } from "viem";
import type { Request, Response } from "express";
import { initTRPC, TRPCError } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import { storeData } from "./fleek";
import { AuctionMetadataSchema, CuratorProfileSchema } from "./types";
import { walletClient } from "./wallet";
import { baseSepolia } from "viem/chains";

const registryContractAddress = "0x75da61536510ba0bca0c9af21311a1fc035dcf4e";

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
    .output(
      z.object({
        ipfsCid: z.string(),
        signature: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const userTwitter = ctx.req.user?.username;
      const userTwitterId = Number(ctx.req.user?.id);

      if (!userTwitter || !Number.isInteger(userTwitterId)) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Failed to get Twitter username/id from user.",
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

      const xId = BigInt(userTwitterId);

      const DOMAIN_TYPE = [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ] as const;

      const REGISTRATION_TYPE = [
        { name: "curator", type: "address" },
        { name: "xId", type: "uint256" },
        { name: "ipfsCID", type: "string" },
      ] as const;

      const domain = {
        name: "Axis Metadata Registry",
        version: "v1.0.0",
        chainId: BigInt(baseSepolia.id),
        verifyingContract: registryContractAddress as Address,
      } as const;

      const message = {
        curator: input.address as Address,
        xId,
        ipfsCID: ipfsCid,
      } as const;

      const signature = (await walletClient.signTypedData({
        domain,
        types: {
          EIP712Domain: DOMAIN_TYPE,
          CuratorRegistration: REGISTRATION_TYPE,
        },
        primaryType: "CuratorRegistration",
        message,
      })) as `0x${string}`;

      console.log("Curator profile stored:", ipfsCid, input);

      return {
        ipfsCid,
        signature,
      };
    }),
});

export type AppRouter = typeof appRouter;

export const context = createContext;
