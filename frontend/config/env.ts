// All env var reads for the static server live here (ADR-0008). Nothing else reads process.env.

function readPort(raw: string | undefined): number {
  const port = Number(raw ?? "3000");
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`PORT inválida: "${raw}"`);
  }
  return port;
}

export const env = {
  PORT: readPort(process.env.PORT),
  STATIC_DIR: process.env.STATIC_DIR ?? "dist/client",
} as const;
