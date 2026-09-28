import { z } from "zod";

// All environment variables are read and validated here at startup.
// No other file may read from process.env directly.
// Add new variables here; never scatter process.env accesses across the codebase (ADR-0008).
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  PORT: z.coerce.number().default(3001),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // External-call HTTP client + structured logging (ADR-0008, ADR-0013).
  EXTERNAL_HTTP_MAX_RETRIES: z.coerce.number().int().min(0).default(3),
  EXTERNAL_HTTP_RETRY_BASE_MS: z.coerce.number().int().min(0).default(200),
  EXTERNAL_HTTP_TIMEOUT_MS: z.coerce.number().int().positive().default(10000),
  EXTERNAL_LOG_MAX_SIZE_MB: z.coerce.number().positive().default(15),
  // Directory for external.log, relative to the backend working directory (→ backend/logs).
  EXTERNAL_LOG_DIR: z.string().default("logs"),
});

export const env = envSchema.parse(process.env);
