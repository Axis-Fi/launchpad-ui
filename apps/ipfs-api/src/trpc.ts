import { initTRPC } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";

// Create express context
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = Awaited<ReturnType<typeof createContext>>;
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const context = createContext;
