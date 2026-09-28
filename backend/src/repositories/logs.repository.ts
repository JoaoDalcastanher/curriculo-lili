// Structured external-call log repository (ADR-0013).
//
// Data access for logs is a file read, not a database query: external.log is parsed on
// demand (one JSON object per line), then filtered and paginated in memory. This keeps the
// template free of any migration/table for logging (see ADR-0013 for the file-vs-DB rationale).

import fs from "fs";

import type {
  ExternalCallLogEntry,
  ExternalCallLogFilter,
  ExternalCallLogPage,
} from "../model/log";
import { parseWallClockToComparableTs } from "../utils/dateUtils";
import { EXTERNAL_LOG_FILE } from "../utils/logger";
import type { ILogsRepository } from "./interfaces";

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 100;

export class LogsRepository implements ILogsRepository {
  listExternalCalls(filter: ExternalCallLogFilter): ExternalCallLogPage {
    const all = this.readEntries();
    const endpoints = this.collectEndpoints(all);
    const filtered = this.applyFilters(all, filter);

    const total = filtered.length;
    const pageSize = clamp(filter.pageSize ?? DEFAULT_PAGE_SIZE, 1, MAX_PAGE_SIZE);
    const page = Math.max(1, filter.page ?? 1);
    const start = (page - 1) * pageSize;
    const entries = filtered.slice(start, start + pageSize);

    return { entries, total, endpoints };
  }

  private applyFilters(
    all: ExternalCallLogEntry[],
    filter: ExternalCallLogFilter,
  ): ExternalCallLogEntry[] {
    let filtered = all;

    if (filter.endpoint !== undefined && filter.endpoint.length > 0) {
      const target = filter.endpoint;
      filtered = filtered.filter((entry) => baseEndpoint(entry) === target);
    }

    if (filter.requestId !== undefined && filter.requestId.length > 0) {
      const target = filter.requestId;
      filtered = filtered.filter((entry) => entry.requestId === target);
    }

    if (filter.apenasErros === true) {
      filtered = filtered.filter((entry) => !entry.wasSuccessful);
    }

    const fromTs =
      filter.dataInicio !== undefined && filter.dataInicio.length > 0
        ? parseWallClockToComparableTs(filter.dataInicio)
        : null;
    const toTs =
      filter.dataFim !== undefined && filter.dataFim.length > 0
        ? parseWallClockToComparableTs(filter.dataFim)
        : null;

    if (fromTs !== null || toTs !== null) {
      filtered = filtered.filter((entry) => withinRange(entry.timestamp, fromTs, toTs));
    }

    return filtered;
  }

  private readEntries(): ExternalCallLogEntry[] {
    let content = "";
    try {
      content = fs.readFileSync(EXTERNAL_LOG_FILE, "utf-8");
    } catch {
      return [];
    }

    const entries: ExternalCallLogEntry[] = [];
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.length === 0) {
        continue;
      }
      const parsed = parseEntry(trimmed);
      if (parsed !== null) {
        entries.push(parsed);
      }
    }

    entries.reverse(); // Newest first.
    return entries;
  }

  private collectEndpoints(entries: ExternalCallLogEntry[]): string[] {
    const unique = new Set<string>();
    for (const entry of entries) {
      unique.add(baseEndpoint(entry));
    }
    return [...unique].sort();
  }
}

function withinRange(timestamp: string, fromTs: number | null, toTs: number | null): boolean {
  const ts = parseWallClockToComparableTs(timestamp);
  if (ts === null) {
    return false;
  }
  if (fromTs !== null && ts < fromTs) {
    return false;
  }
  if (toTs !== null && ts > toTs) {
    return false;
  }
  return true;
}

function baseEndpoint(entry: ExternalCallLogEntry): string {
  const queryStart = entry.endpoint.indexOf("?");
  if (queryStart === -1) {
    return entry.endpoint;
  }
  return entry.endpoint.slice(0, queryStart);
}

function parseEntry(line: string): ExternalCallLogEntry | null {
  try {
    const value: unknown = JSON.parse(line);
    if (isExternalCallLogEntry(value)) {
      return value;
    }
    return null;
  } catch {
    return null;
  }
}

function isExternalCallLogEntry(value: unknown): value is ExternalCallLogEntry {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.timestamp === "string" &&
    (entry.requestId === null || typeof entry.requestId === "string") &&
    typeof entry.attempt === "number" &&
    typeof entry.method === "string" &&
    typeof entry.endpoint === "string" &&
    typeof entry.wasSuccessful === "boolean"
  );
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export const logsRepository = new LogsRepository();
