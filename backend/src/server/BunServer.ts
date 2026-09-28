import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { Server } from "bun";

import { appRouter } from "../routers";
import { createContext } from "../trpc";
import { generateRequestId, requestIdStorage } from "../utils/requestContext";
import { applyCorsHeaders } from "./cors";
import { CsrfService } from "./CsrfService";
import { RateLimiterService } from "./RateLimiterService";
import { applySecurityHeaders } from "./security";
import { BunSession } from "./SessionService";

const MAX_REQUESTS_PER_MINUTE = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS ?? "60", 10);
const globalRateLimiter = new RateLimiterService(MAX_REQUESTS_PER_MINUTE, 60_000);

function getClientIp(req: Request, server: Server<undefined>): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded != null && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return server.requestIP(req)?.address ?? "unknown";
}

function buildBaseHeaders(req: Request): Headers {
  const headers = new Headers();
  applySecurityHeaders(headers);
  applyCorsHeaders(req, headers);
  return headers;
}

function jsonResponse(body: unknown, status: number, baseHeaders: Headers): Response {
  const headers = new Headers(baseHeaders);
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}

// Every request runs inside a request_id scope so getRequestId() resolves for the whole
// async chain — including any external call the request triggers (ADR-0013).
export function handleRequest(req: Request, server: Server<undefined>): Promise<Response> {
  return requestIdStorage.run({ requestId: generateRequestId() }, () =>
    handleRequestInScope(req, server),
  );
}

async function handleRequestInScope(req: Request, server: Server<undefined>): Promise<Response> {
  const url = new URL(req.url);
  const baseHeaders = buildBaseHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: baseHeaders });
  }

  const ip = getClientIp(req, server);
  if (!globalRateLimiter.check(ip)) {
    return jsonResponse(
      { error: "Muitas requisições", message: "Aguarde um momento e tente novamente." },
      429,
      baseHeaders,
    );
  }

  if (!url.pathname.startsWith("/api/")) {
    return jsonResponse({ error: "Não encontrado" }, 404, baseHeaders);
  }

  const session = await BunSession.fromRequest(req);

  if (url.pathname === "/api/csrf-token" && req.method === "GET") {
    const token = CsrfService.generate(session);
    await session.save();
    const headers = new Headers(baseHeaders);
    headers.set("Content-Type", "application/json");
    const cookie = session.buildSetCookieHeader();
    if (cookie != null && cookie.length > 0) {
      headers.append("Set-Cookie", cookie);
    }
    return new Response(JSON.stringify({ token }), { status: 200, headers });
  }

  if (url.pathname.startsWith("/api/trpc")) {
    if (CsrfService.isMutating(req.method)) {
      const headerToken = req.headers.get("x-csrf-token");
      if (!CsrfService.validate(session, headerToken)) {
        return jsonResponse({ message: "Token CSRF inválido ou expirado" }, 403, baseHeaders);
      }
      CsrfService.revoke(session);
    }

    const resHeaders = new Headers();
    const trpcResponse = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req,
      router: appRouter,
      createContext: () => createContext({ req, session, resHeaders, ip }),
      responseMeta: ({ ctx }) => ({ headers: ctx?.resHeaders ?? new Headers() }),
      onError: ({ error, path }) => {
        if (error.code === "INTERNAL_SERVER_ERROR") {
          console.error("[500] tRPC", path, error.message);
        }
      },
    });

    await session.save();

    const finalHeaders = new Headers(baseHeaders);
    for (const [key, value] of trpcResponse.headers.entries()) {
      finalHeaders.append(key, value);
    }
    for (const [key, value] of resHeaders.entries()) {
      finalHeaders.append(key, value);
    }
    const cookie = session.buildSetCookieHeader();
    if (cookie != null && cookie.length > 0) {
      finalHeaders.append("Set-Cookie", cookie);
    }

    return new Response(trpcResponse.body, {
      status: trpcResponse.status,
      headers: finalHeaders,
    });
  }

  return jsonResponse({ error: "Não encontrado" }, 404, baseHeaders);
}
