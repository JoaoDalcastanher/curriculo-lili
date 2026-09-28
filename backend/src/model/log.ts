// Named models for structured external-call logging (ADR-0005, ADR-0013).
// All shapes that cross a layer boundary (transport → repository → service → router) live here.

/** A single logged attempt of an outbound HTTP call (one entry per retry attempt). */
export interface ExternalCallLogEntry {
  /** "YYYY-MM-DD HH:mm:ss.SSS" in the application timezone. */
  timestamp: string;
  /** Correlation id from AsyncLocalStorage, or null when outside a request scope. */
  requestId: string | null;
  /** 1-based attempt number within the retry loop. */
  attempt: number;
  method: string;
  /** Request URL/path (query string already credential-redacted). */
  endpoint: string;
  /** Request body/params, credential-redacted. */
  requestedBody: unknown;
  /** Response body (or error info), credential-redacted. */
  responseBody: unknown;
  wasSuccessful: boolean;
}

/** Filters accepted by the log-reading endpoint. All optional. */
export interface ExternalCallLogFilter {
  page?: number;
  pageSize?: number;
  endpoint?: string;
  requestId?: string;
  /** Inclusive lower bound, parseable datetime string. */
  dataInicio?: string;
  /** Inclusive upper bound, parseable datetime string. */
  dataFim?: string;
  /** When true, only failed calls (wasSuccessful === false) are returned. */
  apenasErros?: boolean;
}

/** One page of parsed log entries plus the distinct endpoint list for the filter dropdown. */
export interface ExternalCallLogPage {
  entries: ExternalCallLogEntry[];
  total: number;
  endpoints: string[];
}
