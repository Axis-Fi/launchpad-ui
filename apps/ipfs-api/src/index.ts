import { appRouter, context } from "./trpc";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import * as dotenv from "dotenv";

// Read .env files
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: context,
  }),
);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export type AppRouter = typeof appRouter;
