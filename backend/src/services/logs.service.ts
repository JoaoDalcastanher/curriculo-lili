// Structured external-call log service (ADR-0013).
//
// Thin orchestration layer: it delegates to the repository (which owns the file read and
// filtering). The repository is injected via the constructor for testability (ADR-0005),
// mirroring example.service.ts.

import type { ExternalCallLogFilter, ExternalCallLogPage } from "../model/log";
import type { ILogsRepository } from "../repositories/interfaces";
import { logsRepository } from "../repositories/logs.repository";

export class LogsService {
  constructor(private readonly repository: ILogsRepository = logsRepository) {}

  listExternalCalls(filter: ExternalCallLogFilter): ExternalCallLogPage {
    return this.repository.listExternalCalls(filter);
  }
}

export const logsService = new LogsService();
