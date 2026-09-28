// Repository interfaces.
// Services depend on these interfaces, not on concrete classes — enabling mock injection in tests.
// Every interface uses only named types from backend/src/model/ (ADR-0005).

import type { CreateExampleInput, ExampleItem, PaginatedResult } from "../model/example";
import type { ExternalCallLogFilter, ExternalCallLogPage } from "../model/log";

// EXAMPLE — replace with your real repository interfaces.
export interface IExampleRepository {
  list(take: number, skip: number): Promise<PaginatedResult<ExampleItem>>;
  findById(id: string): Promise<ExampleItem | null>;
  create(input: CreateExampleInput): Promise<ExampleItem>;
}

// Structured external-call logs (ADR-0013). File-backed, read-on-demand — no database.
export interface ILogsRepository {
  listExternalCalls(filter: ExternalCallLogFilter): ExternalCallLogPage;
}
