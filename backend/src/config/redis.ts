import { createClient } from "redis";

// Abstraction over Redis so non-production environments use an in-memory fallback.
// Sessions and cache always go through getRedisClient() — never import redis directly.

export interface CacheClient {
  isReady: boolean;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, options: { EX: number }): Promise<unknown>;
  del(key: string): Promise<unknown>;
}

interface CacheEntry {
  value: string;
  expiresAt: number | null;
}

class InMemoryCacheClient implements CacheClient {
  readonly isReady = true;
  private readonly store = new Map<string, CacheEntry>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (entry.expiresAt !== null && entry.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  async set(key: string, value: string, options: { EX: number }): Promise<void> {
    const expiresAt = options.EX > 0 ? Date.now() + options.EX * 1000 : null;
    this.store.set(key, { value, expiresAt });
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";
let client: CacheClient | null = null;

function buildRedisUrl(): string | null {
  if (process.env.REDIS_URL) return process.env.REDIS_URL;
  if (process.env.REDIS_HOST && process.env.REDIS_PORT) {
    return `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
  }
  return null;
}

export function getRedisClient(): CacheClient | null {
  if (client) return client;

  if (!IS_PRODUCTION) {
    console.log("Redis disabled outside production — using in-memory cache store");
    client = new InMemoryCacheClient();
    return client;
  }

  const url = buildRedisUrl();
  if (!url) return null;

  const networkClient = createClient({ url });
  networkClient
    .connect()
    .then(() => console.log("Redis connected"))
    .catch((err) => {
      console.error("Redis connection error:", err);
      client = null;
    });
  client = networkClient as unknown as CacheClient;
  return client;
}
