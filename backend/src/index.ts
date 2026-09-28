import { handleRequest } from "./server/BunServer";
import { env } from "./config/env";

const server = Bun.serve({
  port: env.PORT,
  hostname: "0.0.0.0",
  fetch: handleRequest,
});

console.log(`Server listening on ${server.url}`);
