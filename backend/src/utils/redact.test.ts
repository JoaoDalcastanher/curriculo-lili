import { describe, expect, test } from "bun:test";

import { redactSensitiveFields, redactSensitiveQueryParams } from "./redact";

describe("redactSensitiveFields", () => {
  test("redacts a sensitive key nested inside an object", () => {
    const input = {
      user: "joao",
      credentials: { senha: "super-secret", role: "admin" },
    };
    const result = redactSensitiveFields(input) as {
      user: string;
      credentials: { senha: string; role: string };
    };
    expect(result.credentials.senha).toBe("[REDACTED]");
    expect(result.credentials.role).toBe("admin");
    expect(result.user).toBe("joao");
  });

  test("redacts sensitive keys inside arrays", () => {
    const input = [{ token: "abc123" }, { name: "keep" }];
    const result = redactSensitiveFields(input) as Array<Record<string, string>>;
    expect(result[0].token).toBe("[REDACTED]");
    expect(result[1].name).toBe("keep");
  });

  test("matches keys case-insensitively", () => {
    const result = redactSensitiveFields({ Authorization: "Bearer x" }) as {
      Authorization: string;
    };
    expect(result.Authorization).toBe("[REDACTED]");
  });

  test("does not mutate the original object", () => {
    const input = { password: "keep-me-here" };
    redactSensitiveFields(input);
    expect(input.password).toBe("keep-me-here");
  });

  test("returns primitives and null unchanged", () => {
    expect(redactSensitiveFields("hello")).toBe("hello");
    expect(redactSensitiveFields(42)).toBe(42);
    expect(redactSensitiveFields(null)).toBe(null);
  });

  test("handles circular references without throwing", () => {
    const input: Record<string, unknown> = { name: "a" };
    input.self = input;
    const result = redactSensitiveFields(input) as Record<string, unknown>;
    expect(result.name).toBe("a");
    expect(result.self).toBe("[Circular]");
  });
});

describe("redactSensitiveQueryParams", () => {
  test("redacts a sensitive query param value", () => {
    const result = redactSensitiveQueryParams(
      "https://api.example.com/auth?user=joao&pass=hunter2",
    );
    expect(result).toBe("https://api.example.com/auth?user=joao&pass=[REDACTED]");
  });

  test("redacts multiple sensitive params and preserves order", () => {
    const result = redactSensitiveQueryParams("/path?token=abc&keep=1&secret=xyz");
    expect(result).toBe("/path?token=[REDACTED]&keep=1&secret=[REDACTED]");
  });

  test("leaves a url without a query string untouched", () => {
    const url = "https://api.example.com/health";
    expect(redactSensitiveQueryParams(url)).toBe(url);
  });

  test("preserves a trailing hash fragment", () => {
    const result = redactSensitiveQueryParams("/p?pass=x#section");
    expect(result).toBe("/p?pass=[REDACTED]#section");
  });
});
