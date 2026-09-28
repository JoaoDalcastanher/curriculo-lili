import { describe, expect, test } from "bun:test";

import { formatYearRange, getCurrentYear, yearRangeSortKey } from "./datetime";

describe("getCurrentYear", () => {
  test("uses São Paulo time at the year boundary", () => {
    // 2026-01-01T01:00Z is still 2025-12-31 in São Paulo.
    expect(getCurrentYear(new Date("2026-01-01T01:00:00Z"))).toBe(2025);
    expect(getCurrentYear(new Date("2026-01-01T12:00:00Z"))).toBe(2026);
  });
});

describe("formatYearRange", () => {
  test("formats closed and ongoing ranges", () => {
    expect(formatYearRange({ start: 2018, end: 2021 })).toBe("2018 — 2021");
    expect(formatYearRange({ start: 2021, end: null })).toBe("2021 — hoje");
  });
});

describe("yearRangeSortKey", () => {
  test("orders by end year, then start year, with ongoing last", () => {
    const key = yearRangeSortKey;
    expect(key({ start: 2015, end: 2018 })).toBeLessThan(key({ start: 2018, end: 2021 }));
    expect(key({ start: 2014, end: 2021 })).toBeLessThan(key({ start: 2018, end: 2021 }));
    expect(key({ start: 2021, end: null })).toBeGreaterThan(key({ start: 2000, end: 2999 }));
  });
});
