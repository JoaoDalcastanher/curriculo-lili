import { describe, expect, test } from "bun:test";

import type { ExternalCallLogFilter, ExternalCallLogPage } from "../model/log";
import type { ILogsRepository } from "../repositories/interfaces";
import { LogsService } from "./logs.service";

describe("LogsService", () => {
  test("delegates to the repository, forwarding the filter and returning its page", () => {
    const page: ExternalCallLogPage = {
      entries: [],
      total: 0,
      endpoints: ["https://a.example.com/x"],
    };
    const receivedFilters: ExternalCallLogFilter[] = [];

    const repository: ILogsRepository = {
      listExternalCalls(filter) {
        receivedFilters.push(filter);
        return page;
      },
    };

    const service = new LogsService(repository);
    const filter: ExternalCallLogFilter = {
      page: 2,
      pageSize: 25,
      endpoint: "https://a.example.com/x",
      apenasErros: true,
    };

    const result = service.listExternalCalls(filter);

    expect(result).toBe(page);
    expect(receivedFilters).toHaveLength(1);
    expect(receivedFilters[0]).toEqual(filter);
  });
});
