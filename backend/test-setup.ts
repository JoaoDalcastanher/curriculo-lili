// Test preload (see bunfig.toml). Runs before any test file imports config/env, so the
// Zod env schema parses cleanly and the logger writes to an isolated temp directory instead
// of the real backend/logs.

import { mkdtempSync } from "fs";
import { tmpdir } from "os";
import path from "path";

process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/test";
process.env.SESSION_SECRET ??= "test-session-secret-that-is-32-chars-long";
process.env.REDIS_URL ??= "redis://localhost:6379";
process.env.NODE_ENV = "test";

// Always isolate log output for tests.
process.env.EXTERNAL_LOG_DIR = mkdtempSync(path.join(tmpdir(), "base-repo-logs-"));
