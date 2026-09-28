import { describe, expect, test } from "bun:test";
import fs from "fs";

import type { ExternalCallLogEntry } from "../model/log";
import { EXTERNAL_LOG_FILE } from "../utils/logger";
import { logsRepository } from "./logs.repository";

function makeEntry(over: Partial<ExternalCallLogEntry>): ExternalCallLogEntry {
  return {
    timestamp: "2026-07-18 10:00:00.000",
    requestId: "r1",
    attempt: 1,
    method: "GET",
    endpoint: "https://a.example.com/x",
    requestedBody: null,
    responseBody: null,
    wasSuccessful: true,
    ...over,
  };
}

function writeLog(entries: ExternalCallLogEntry[]): void {
  const content = entries.map((entry) => JSON.stringify(entry)).join("\n");
  fs.writeFileSync(EXTERNAL_LOG_FILE, `${content}\n`);
}

const sample: ExternalCallLogEntry[] = [
  makeEntry({
    timestamp: "2026-07-18 10:00:00.000",
    requestId: "r1",
    endpoint: "https://a.example.com/x?pass=[REDACTED]",
    wasSuccessful: true,
  }),
  makeEntry({
    timestamp: "2026-07-18 11:00:00.000",
    requestId: "r2",
    endpoint: "https://b.example.com/y",
    wasSuccessful: false,
  }),
  makeEntry({
    timestamp: "2026-07-18 12:00:00.000",
    requestId: "r3",
    endpoint: "https://a.example.com/x?pass=[REDACTED]",
    wasSuccessful: true,
  }),
];

describe("LogsRepository.listExternalCalls", () => {
  test("returns entries newest-first with the correct total", () => {
    writeLog(sample);
    const page = logsRepository.listExternalCalls({});
    expect(page.total).toBe(3);
    expect(page.entries.map((entry) => entry.requestId)).toEqual(["r3", "r2", "r1"]);
  });

  test("collects the distinct base endpoints, sorted, query stripped", () => {
    writeLog(sample);
    const page = logsRepository.listExternalCalls({});
    expect(page.endpoints).toEqual(["https://a.example.com/x", "https://b.example.com/y"]);
  });

  test("filters by endpoint (query string ignored)", () => {
    writeLog(sample);
    const page = logsRepository.listExternalCalls({
      endpoint: "https://a.example.com/x",
    });
    expect(page.total).toBe(2);
  });

  test("filters by requestId", () => {
    writeLog(sample);
    expect(logsRepository.listExternalCalls({ requestId: "r2" }).total).toBe(1);
  });

  test("filters to errors only with apenasErros", () => {
    writeLog(sample);
    const page = logsRepository.listExternalCalls({ apenasErros: true });
    expect(page.total).toBe(1);
    expect(page.entries[0].requestId).toBe("r2");
  });

  test("filters by datetime range (inclusive bounds)", () => {
    writeLog(sample);
    expect(logsRepository.listExternalCalls({ dataInicio: "2026-07-18T11:00" }).total).toBe(2);
    expect(logsRepository.listExternalCalls({ dataFim: "2026-07-18T11:00" }).total).toBe(2);
  });

  test("paginates", () => {
    writeLog(sample);
    const first = logsRepository.listExternalCalls({ page: 1, pageSize: 2 });
    expect(first.entries.length).toBe(2);
    expect(first.total).toBe(3);
    const second = logsRepository.listExternalCalls({ page: 2, pageSize: 2 });
    expect(second.entries.length).toBe(1);
  });

  test("skips malformed and incomplete lines", () => {
    fs.writeFileSync(
      EXTERNAL_LOG_FILE,
      `not json\n${JSON.stringify(makeEntry({ requestId: "ok" }))}\n{"partial":true}\n`,
    );
    const page = logsRepository.listExternalCalls({});
    expect(page.total).toBe(1);
    expect(page.entries[0].requestId).toBe("ok");
  });

  test("returns an empty page when the log file is absent", () => {
    fs.rmSync(EXTERNAL_LOG_FILE, { force: true });
    const page = logsRepository.listExternalCalls({});
    expect(page.total).toBe(0);
    expect(page.entries).toEqual([]);
    expect(page.endpoints).toEqual([]);
  });
});
