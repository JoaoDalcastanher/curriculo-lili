import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import { requestWithRetry } from "./httpClient";
import { redactSensitiveFields, redactSensitiveQueryParams } from "./redact";

let server: ReturnType<typeof Bun.serve>;
let baseUrl: string;
let flakyAttempts = 0;

beforeAll(() => {
  server = Bun.serve({
    port: 0,
    fetch(req) {
      const url = new URL(req.url);
      if (url.pathname === "/ok") {
        return Response.json({ ok: true });
      }
      if (url.pathname === "/flaky") {
        flakyAttempts += 1;
        if (flakyAttempts < 2) {
          return new Response("busy", { status: 503 });
        }
        return Response.json({ done: true });
      }
      return new Response("not found", { status: 404 });
    },
  });
  baseUrl = server.url.toString().replace(/\/$/, "");
});

afterAll(() => {
  void server.stop(true);
});

describe("requestWithRetry", () => {
  test("returns parsed JSON data on success", async () => {
    const res = await requestWithRetry(`GET`, `${baseUrl}/ok`);
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ ok: true });
  });

  test("retries a retryable status then succeeds", async () => {
    flakyAttempts = 0;
    const res = await requestWithRetry("GET", `${baseUrl}/flaky`, {
      retryBaseMs: 1,
      maxRetries: 3,
    });
    expect(res.status).toBe(200);
    expect(res.data).toEqual({ done: true });
    expect(flakyAttempts).toBe(2);
  });

  test("resolves (does not throw) on a non-retryable error status", async () => {
    const res = await requestWithRetry("GET", `${baseUrl}/missing`);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
  });
});

describe("credential redaction (what httpClient logs)", () => {
  test("a call carrying secrets in body and query produces no cleartext", () => {
    // Mirrors the transformation httpClient applies before logExternalCall.
    const requestedBody = {
      params: undefined,
      body: { usuario: "joao", senha: "super-secret" },
    };
    const url = `${baseUrl}/auth/empresa?scope=read&pass=hunter2&token=jwt-abc`;

    const loggedBody = JSON.stringify(redactSensitiveFields(requestedBody));
    const loggedEndpoint = redactSensitiveQueryParams(url);

    expect(loggedBody).not.toContain("super-secret");
    expect(loggedBody).toContain("[REDACTED]");
    expect(loggedEndpoint).not.toContain("hunter2");
    expect(loggedEndpoint).not.toContain("jwt-abc");
    expect(loggedEndpoint).toContain("scope=read");
  });
});
