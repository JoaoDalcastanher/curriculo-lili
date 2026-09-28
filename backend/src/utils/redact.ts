// Credential redaction for structured logging.
//
// External requests/responses frequently carry credentials inside bodies and query
// strings (senha/password/token/authorization/...). These helpers replace those values
// with "[REDACTED]" before anything is written to a log file. See ADR-0013.

const REDACTED = "[REDACTED]";

/** Keys whose values must never be logged in cleartext (matched case-insensitively). */
const SENSITIVE_KEYS = new Set([
  "senha",
  "password",
  "pass",
  "token",
  "secret",
  "authorization",
  "auth",
  "apikey",
  "api_key",
  "accesstoken",
  "access_token",
  "refreshtoken",
  "refresh_token",
  "clientsecret",
  "client_secret",
]);

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.has(key.toLowerCase());
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Deep-walks objects/arrays and replaces the value of any sensitive key with "[REDACTED]".
 * Non-object values (and unknown shapes) are returned unchanged. Cycles are guarded.
 */
export function redactSensitiveFields(
  value: unknown,
  seen: WeakSet<object> = new WeakSet<object>(),
): unknown {
  if (Array.isArray(value)) {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    return value.map((item) => redactSensitiveFields(item, seen));
  }

  if (value !== null && typeof value === "object") {
    if (seen.has(value)) {
      return "[Circular]";
    }
    seen.add(value);
    const source = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(source)) {
      result[key] = isSensitiveKey(key) ? REDACTED : redactSensitiveFields(source[key], seen);
    }
    return result;
  }

  return value;
}

/**
 * Replaces the value of any sensitive query-string parameter with "[REDACTED]",
 * preserving the rest of the URL (path, non-sensitive params, hash) as-is. The URL
 * may be absolute or relative. On any parse problem the original string is returned.
 */
export function redactSensitiveQueryParams(url: string): string {
  const queryStart = url.indexOf("?");
  if (queryStart === -1) {
    return url;
  }

  const base = url.slice(0, queryStart);
  const afterQuery = url.slice(queryStart + 1);
  const hashStart = afterQuery.indexOf("#");
  const query = hashStart === -1 ? afterQuery : afterQuery.slice(0, hashStart);
  const hash = hashStart === -1 ? "" : afterQuery.slice(hashStart);

  if (query.length === 0) {
    return url;
  }

  const redactedPairs = query.split("&").map((pair) => {
    const eq = pair.indexOf("=");
    if (eq === -1) {
      return pair;
    }
    const rawKey = pair.slice(0, eq);
    if (isSensitiveKey(safeDecode(rawKey))) {
      return `${rawKey}=${REDACTED}`;
    }
    return pair;
  });

  return `${base}?${redactedPairs.join("&")}${hash}`;
}
