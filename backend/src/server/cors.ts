// Allowed origins are env-configurable (ADR-0008).
// Set ALLOWED_ORIGINS as a comma-separated list in production.
// Example: ALLOWED_ORIGINS=https://myapp.com,https://admin.myapp.com

const IS_PRODUCTION = process.env.NODE_ENV === "production";

function buildAllowedOrigins(): Set<string> {
  const fromEnv = process.env.ALLOWED_ORIGINS;
  if (fromEnv) {
    return new Set(
      fromEnv
        .split(",")
        .map((s) => s.trim().replace(/\/$/, "").toLowerCase())
        .filter(Boolean),
    );
  }
  if (!IS_PRODUCTION) {
    return new Set([
      "http://localhost:3000",
      "http://localhost:3002",
      "http://127.0.0.1:3000",
    ]);
  }
  return new Set();
}

const ALLOWED_ORIGINS = buildAllowedOrigins();

export function applyCorsHeaders(req: Request, headers: Headers): void {
  const origin = req.headers.get("origin");
  if (!origin) return;

  const normalized = origin.replace(/\/$/, "").toLowerCase();
  if (!ALLOWED_ORIGINS.has(normalized)) {
    console.warn(`CORS blocked origin: ${origin}`);
    return;
  }

  headers.set("Access-Control-Allow-Origin", normalized);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set(
    "Access-Control-Allow-Methods",
    "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS",
  );
  headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, x-csrf-token, Accept, Authorization",
  );
  headers.set("Vary", "Origin");
}
