// Serves the prerendered site (dist/client) on Railway. No SSR, no API — just files.
// Railway injects PORT; see config/env.ts.

import { join, normalize } from "node:path";

import { env } from "./config/env";

export class StaticSiteServer {
  constructor(private readonly rootDir: string) {}

  resolvePath(pathname: string): string | null {
    const decoded = decodeURIComponent(pathname);
    const relative = normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
    if (relative.includes("..")) {
      return null;
    }
    const withIndex = relative.endsWith("/") ? `${relative}index.html` : relative;
    return join(this.rootDir, withIndex);
  }

  async handle(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const filePath = this.resolvePath(url.pathname);
    if (filePath === null) {
      return new Response("Requisição inválida", { status: 400 });
    }

    const file = Bun.file(filePath);
    if (await file.exists()) {
      return new Response(file, { headers: this.cacheHeaders(url.pathname) });
    }

    // A folder asked without the trailing slash (e.g. /recurso-pedagogia/pingo) goes to its index (/recurso-pedagogia/pingo/).
    const folderIndex = Bun.file(join(filePath, "index.html"));
    if (!url.pathname.endsWith("/") && (await folderIndex.exists())) {
      return Response.redirect(`${url.pathname}/${url.search}`, 301);
    }

    const htmlFallback = Bun.file(join(this.rootDir, "index.html"));
    return new Response(htmlFallback, {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  private cacheHeaders(pathname: string): Record<string, string> {
    // Hashed bundles of the site (/assets/) and of the game (/recurso-pedagogia/pingo/assets/).
    const isHashedAsset = /^\/(recurso-pedagogia\/pingo\/)?assets\//.test(pathname);
    return {
      "Cache-Control": isHashedAsset
        ? "public, max-age=31536000, immutable"
        : "public, max-age=300",
    };
  }
}

if (import.meta.main) {
  const site = new StaticSiteServer(join(import.meta.dir, env.STATIC_DIR));
  const server = Bun.serve({ port: env.PORT, fetch: (request) => site.handle(request) });
  console.log(`Site no ar em http://localhost:${server.port}`);
}
