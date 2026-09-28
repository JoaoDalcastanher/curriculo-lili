// Shared outbound HTTP client for the template (permanent infrastructure — ADR-0013).
//
// Every external call in a derived repo should go through requestWithRetry so it gets,
// for free: exponential-backoff retries, per-attempt structured logging to external.log,
// request_id correlation, and credential redaction. Built on the native fetch (Bun) — no
// axios dependency.

import { env } from "../config/env";
import { logExternalCall } from "./logger";
import { redactSensitiveFields, redactSensitiveQueryParams } from "./redact";
import { getRequestId } from "./requestContext";

export type QueryParamValue = string | number | boolean | undefined;

export interface RequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  params?: Record<string, QueryParamValue>;
  /** Per-attempt timeout. Defaults to env.EXTERNAL_HTTP_TIMEOUT_MS. */
  timeoutMs?: number;
  /** Max retries after the first attempt. Defaults to env.EXTERNAL_HTTP_MAX_RETRIES. */
  maxRetries?: number;
  /** Base backoff delay. Defaults to env.EXTERNAL_HTTP_RETRY_BASE_MS. */
  retryBaseMs?: number;
}

export interface HttpResponse<T = unknown> {
  ok: boolean;
  status: number;
  data: T;
}

/** HTTP statuses worth retrying (transient upstream failures / rate limiting). */
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

/**
 * Performs an HTTP request with retries. Any HTTP response (including non-2xx) resolves to
 * an HttpResponse; a network failure that survives all retries throws the last error. Every
 * attempt is logged (redacted) to external.log.
 *
 * The parsed body is returned as `data`, so there is no caller-visible Response stream to
 * preserve — the body is read exactly once and reused for both the log and the return value.
 */
export async function requestWithRetry<T = unknown>(
  method: string,
  url: string,
  options: RequestOptions = {},
): Promise<HttpResponse<T>> {
  const maxRetries = options.maxRetries ?? env.EXTERNAL_HTTP_MAX_RETRIES;
  const timeoutMs = options.timeoutMs ?? env.EXTERNAL_HTTP_TIMEOUT_MS;
  const upperMethod = method.toUpperCase();
  const finalUrl = buildUrl(url, options.params);
  const requestedBody = buildRequestedBody(options);

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      const response = await fetch(finalUrl, {
        method: upperMethod,
        headers: buildHeaders(options),
        body: serializeBody(options.body, upperMethod),
        signal: AbortSignal.timeout(timeoutMs),
      });

      const data = await readBody(response);
      const wasSuccessful = response.ok;
      const willRetry = RETRYABLE_STATUSES.has(response.status) && attempt <= maxRetries;

      logAttempt(attempt, upperMethod, finalUrl, requestedBody, data, wasSuccessful);

      if (willRetry) {
        await delay(backoffMs(attempt, options));
        continue;
      }

      return { ok: wasSuccessful, status: response.status, data: data as T };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logAttempt(
        attempt,
        upperMethod,
        finalUrl,
        requestedBody,
        { error: lastError.message },
        false,
      );

      if (attempt <= maxRetries) {
        await delay(backoffMs(attempt, options));
        continue;
      }
    }
  }

  throw lastError ?? new Error("requestWithRetry: request failed");
}

function logAttempt(
  attempt: number,
  method: string,
  endpoint: string,
  requestedBody: unknown,
  responseBody: unknown,
  wasSuccessful: boolean,
): void {
  logExternalCall({
    requestId: getRequestId() ?? null,
    attempt,
    method,
    endpoint: redactSensitiveQueryParams(endpoint),
    requestedBody: redactSensitiveFields(requestedBody),
    responseBody: redactSensitiveFields(responseBody),
    wasSuccessful,
  });
}

function buildUrl(url: string, params?: RequestOptions["params"]): string {
  if (params === undefined) {
    return url;
  }
  const entries = Object.entries(params).filter(([, value]) => value !== undefined);
  if (entries.length === 0) {
    return url;
  }
  const search = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${search}`;
}

function buildRequestedBody(options: RequestOptions): unknown {
  const hasParams = options.params !== undefined && Object.keys(options.params).length > 0;
  const hasBody = options.body !== undefined;
  if (!hasParams && !hasBody) {
    return null;
  }
  return {
    params: hasParams ? options.params : undefined,
    body: hasBody ? options.body : undefined,
  };
}

function buildHeaders(options: RequestOptions): Record<string, string> {
  const headers: Record<string, string> = { ...options.headers };
  const bodyIsJson =
    options.body !== undefined && options.body !== null && typeof options.body !== "string";
  const hasContentType =
    headers["Content-Type"] !== undefined || headers["content-type"] !== undefined;
  if (bodyIsJson && !hasContentType) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

function serializeBody(body: unknown, method: string): string | undefined {
  if (body === undefined || body === null) {
    return undefined;
  }
  if (method === "GET" || method === "HEAD") {
    return undefined;
  }
  if (typeof body === "string") {
    return body;
  }
  return JSON.stringify(body);
}

async function readBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (text.length === 0) {
    return null;
  }
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function backoffMs(attempt: number, options: RequestOptions): number {
  const base = options.retryBaseMs ?? env.EXTERNAL_HTTP_RETRY_BASE_MS;
  return base * 2 ** (attempt - 1);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
