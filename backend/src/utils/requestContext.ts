import { AsyncLocalStorage } from "async_hooks";
import crypto from "crypto";

export interface RequestContext {
  requestId: string;
}

export const requestIdStorage = new AsyncLocalStorage<RequestContext>();

/**
 * Generates a short hash for request tracing (8 hex chars).
 * Use this as request_id to correlate all logs for a single request.
 */
export function generateRequestId(): string {
  return crypto.randomBytes(4).toString("hex");
}

export function getRequestId(): string | undefined {
  return requestIdStorage.getStore()?.requestId;
}
