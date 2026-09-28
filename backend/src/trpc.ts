import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { BunSession } from "./server/SessionService";

export type Context = {
  req: Request;
  session: BunSession;
  resHeaders: Headers;
  ip: string;
  user?: { id: number };
};

export function createContext({
  req,
  session,
  resHeaders,
  ip,
}: {
  req: Request;
  session: BunSession;
  resHeaders: Headers;
  ip: string;
}): Context {
  const user = session.userId ? { id: session.userId } : undefined;
  return { req, session, resHeaders, ip, user };
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

// Use for endpoints that require an authenticated user (ADR-0012).
export const protectedProcedure = publicProcedure.use((opts) => {
  const { ctx } = opts;
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Você precisa estar logado para acessar este recurso.",
    });
  }
  return opts.next({ ctx: { ...ctx, user: ctx.user } });
});

/**
 * Use for admin-only endpoints.
 * TODO: Replace this stub with your project's actual permission check.
 * The actionName parameter identifies the action being gated (e.g. "admin.users.delete").
 * Typical implementation: call a PermissionService, throw FORBIDDEN if not allowed.
 */
export function createAdminProcedure(_actionName: string) {
  return protectedProcedure;
}
