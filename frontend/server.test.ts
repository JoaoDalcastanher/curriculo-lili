import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { StaticSiteServer } from "./server";

let root = "";
let site: StaticSiteServer;

beforeAll(async () => {
  root = await mkdtemp(join(tmpdir(), "site-"));
  await mkdir(join(root, "assets"));
  await writeFile(join(root, "index.html"), "<h1>Lili</h1>");
  await writeFile(join(root, "assets", "app-abc123.js"), "console.log(1)");
  site = new StaticSiteServer(root);
});

afterAll(async () => {
  await rm(root, { recursive: true, force: true });
});

function get(path: string): Promise<Response> {
  return site.handle(new Request(`http://localhost${path}`));
}

describe("StaticSiteServer", () => {
  test("serves index.html at /", async () => {
    const response = await get("/");
    expect(response.status).toBe(200);
    expect(await response.text()).toBe("<h1>Lili</h1>");
  });

  test("caches hashed assets forever", async () => {
    const response = await get("/assets/app-abc123.js");
    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toContain("immutable");
  });

  test("falls back to the home page with 404 for unknown paths", async () => {
    const response = await get("/nao-existe");
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("<h1>Lili</h1>");
  });

  test("never resolves outside the root directory", () => {
    const resolved = site.resolvePath("/%2e%2e/%2e%2e/etc/passwd");
    expect(resolved === null || resolved.startsWith(root)).toBe(true);
  });
});
