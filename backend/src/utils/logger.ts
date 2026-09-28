// Structured logger for the `external` concern only (ADR-0013).
//
// One JSON object per line is written to external.log via a self-truncating file
// transport. There is deliberately no combined/error/query/memory logger here — the
// template has no crons or business queries to justify them. A derived repo adds more
// concerns only when it grows a need for them.

import path from "path";
import winston from "winston";

import { env } from "../config/env";
import type { ExternalCallLogEntry } from "../model/log";
import { getTimestampWithMillis } from "./dateUtils";
import { TruncatingFileTransport } from "./TruncatingFileTransport";

const EXTERNAL_LOG_FILE = path.join(env.EXTERNAL_LOG_DIR, "external.log");

const externalLogger = winston.createLogger({
  // We own the whole line: emit the message verbatim (already a JSON string).
  format: winston.format.printf((info) => {
    const { message } = info;
    return typeof message === "string" ? message : "";
  }),
  transports: [
    new TruncatingFileTransport({
      filename: EXTERNAL_LOG_FILE,
      maxSize: env.EXTERNAL_LOG_MAX_SIZE_MB * 1024 * 1024,
    }) as winston.transport,
  ],
});

/*
 * A logging failure must never crash the process. Winston re-emits transport errors
 * on the logger; without a listener Node treats the 'error' event as an uncaught
 * exception. Write straight to stderr (not console.*) to avoid re-entering a transport.
 */
externalLogger.on("error", (err: unknown) => {
  try {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[logger:external] transport error: ${message}\n`);
  } catch {
    // Never let logging-about-logging throw.
  }
});

/**
 * Appends one external-call log entry as a single JSON line. The timestamp is stamped
 * here (via dateUtils) so callers only supply the call metadata.
 */
export function logExternalCall(entry: Omit<ExternalCallLogEntry, "timestamp">): void {
  const full: ExternalCallLogEntry = {
    timestamp: getTimestampWithMillis(),
    ...entry,
  };
  externalLogger.info(JSON.stringify(full));
}

export { EXTERNAL_LOG_FILE };
