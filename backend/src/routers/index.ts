import { router } from "../trpc";
import { exampleRouter } from "./example.router";
import { logsRouter } from "./logs.router";

// Root router — register all feature routers here.
// Remove exampleRouter and add your own once real features are implemented.
// logsRouter is permanent template infrastructure (ADR-0013) — keep it.
export const appRouter = router({
  example: exampleRouter,
  logs: logsRouter,
  // user: userRouter,
  // product: productRouter,
});

// This type is imported by the frontend tRPC client for end-to-end type safety.
export type AppRouter = typeof appRouter;
