// Feature flag helpers. All flags are driven by environment variables (ADR-0008).
// Add a typed function per flag — never read process.env directly in feature code.

function isEnabled(envVar: string): boolean {
  return process.env[envVar] === "true";
}

// EXAMPLE FEATURE FLAGS — replace with your project's actual flags.
// Pattern: one function per flag, named after the feature.
export function isNewDashboardEnabled(): boolean {
  return isEnabled("FEATURE_NEW_DASHBOARD");
}

// External service URLs are also env-configurable.
// Add helpers here rather than scattering process.env reads across services.
export function getApiBaseUrl(): string {
  return process.env.API_BASE_URL ?? "http://localhost:3001";
}
