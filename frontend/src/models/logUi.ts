// Reusable UI types for the external-call log viewer (Policy 002 — reusable UI types live
// under frontend/src/models/, never inside the page/component). Mirrors the backend
// ExternalCallLogEntry (ADR-0013). Body fields are genuinely arbitrary external JSON, so
// `unknown` is the most specific honest type.

export interface ExternalCallLogRow {
  timestamp: string;
  requestId: string | null;
  attempt: number;
  method: string;
  endpoint: string;
  requestedBody: unknown;
  responseBody: unknown;
  wasSuccessful: boolean;
}

/** Applied (committed) filter state driving the log query. */
export interface ExternalCallLogFilters {
  dataInicio: string;
  dataFim: string;
  requestId: string;
  endpoint: string;
  apenasErros: boolean;
}

export const EMPTY_LOG_FILTERS: ExternalCallLogFilters = {
  dataInicio: "",
  dataFim: "",
  requestId: "",
  endpoint: "",
  apenasErros: false,
};
