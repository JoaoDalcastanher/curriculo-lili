# ADR-0009: Bun Workers for Horizontal Scalability

**Status:** Accepted  
**Date:** 2026-06-05

---

## Context

Bun (and Node.js) run on a single thread by default. CPU-bound work blocks the event loop. For I/O-bound workloads a single process is often sufficient, but CPU-bound tasks (image processing, heavy computation, report generation) need off-thread execution.

The alternatives considered were:
1. External services / microservices for CPU work
2. Native worker threads (Bun `Worker`)
3. Multiple backend instances behind a load balancer

---

## Decision

**Bun Workers (`new Worker(...)`) are the default mechanism for intra-process parallelism.** Multiple server instances behind a load balancer are the mechanism for cross-process scaling.

### Single-Process Parallelism — Bun Workers

For CPU-bound tasks that should not block the main event loop, use Bun's `Worker` API:

```ts
// heavy-task.worker.ts — runs in its own thread
self.onmessage = (event) => {
  const result = doExpensiveComputation(event.data);
  self.postMessage(result);
};

// main thread
const worker = new Worker(new URL("./heavy-task.worker.ts", import.meta.url));
worker.postMessage(input);
worker.onmessage = (event) => { /* handle result */ };
```

Rules:
- Workers do not share memory with the main thread (use `SharedArrayBuffer` only when truly necessary and with explicit justification).
- Workers communicate via `postMessage` / `onmessage`.
- Workers are created once at startup and reused from a pool — not spawned per request.
- Worker files are named `*.worker.ts` and colocated with the module that uses them.
- Worker pool size is env-configurable (`WORKER_POOL_SIZE`, see ADR-0008).

### Multi-Instance Scaling

When a single Bun process with workers is insufficient:
- Run multiple instances of the same backend behind a reverse proxy (nginx, Caddy, or a cloud load balancer).
- Sessions must use a shared store (Redis) so any instance can serve any user (see ADR-0012).
- This is a deployment decision, not a code change.

### What Does NOT Belong in Workers

- HTTP request handling — the main thread handles all tRPC and HTTP requests.
- Database access — ORM connections stay on the main thread; workers receive pre-fetched data via `postMessage`.
- Auth and session logic — never in workers.

---

## Consequences

- CPU-bound tasks do not block HTTP request handling.
- The architecture stays simple — no separate microservices for common CPU work.
- Stateless workers and shared Redis sessions mean horizontal scaling is a deployment config change, not a code change.
- **Rule:** if a task takes more than ~50ms of CPU time, it belongs in a worker, not in the request path.
