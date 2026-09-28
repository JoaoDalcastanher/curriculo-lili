// CSRF token management (ADR-0012).
// Tokens are single-use, cached in memory only — never localStorage or cookies.

const BASE_URL = (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL ?? "/api";

let csrfTokenCache: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (csrfTokenCache) return csrfTokenCache;
  const res = await fetch(`${BASE_URL}/csrf-token`, { credentials: "include" });
  const data = (await res.json()) as { token: string };
  csrfTokenCache = data.token;
  return csrfTokenCache;
}

export function clearCsrfCache(): void {
  csrfTokenCache = null;
}
