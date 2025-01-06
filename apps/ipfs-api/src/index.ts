import express, { Request, Response } from "express";
import passport from "passport";
import session from "express-session";
import * as trpcExpress from "@trpc/server/adapters/express";
import type { CreateTRPCProxyClient } from "@trpc/client";
import * as dotenv from "dotenv";
import cors from "cors";
import { appRouter, context } from "./trpc";
import { router as authRoutes } from "./curator/auth";
import "./curator/passport";

// Read .env files
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.DAPP_URL,
    credentials: true,
  }),
);

app.use(
  session({
    secret: process.env.SERVER_SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: context,
  }),
);

app.use((err: Error, _: Request, res: Response) => {
  console.error("Error:", err);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

export type AppRouter = typeof appRouter;

// @ts-expect-error TODO: why is AppRouter an issue here?
export type MetadataClient = CreateTRPCProxyClient<AppRouter>;
