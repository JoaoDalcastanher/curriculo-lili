import { randomBytes } from "node:crypto";
import { getRedisClient } from "../config/redis";

// Session TTL and cookie config (ADR-0012).
const SESSION_TTL_SECONDS = 48 * 60 * 60;
const REDIS_PREFIX = "app:sess:";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
// Set SESSION_COOKIE_DOMAIN in production, e.g. ".myapp.com"
const COOKIE_DOMAIN =
  IS_PRODUCTION && process.env.SESSION_COOKIE_DOMAIN
    ? `Domain=${process.env.SESSION_COOKIE_DOMAIN}; `
    : "";

// Add project-specific session fields here as your app grows.
interface SessionData {
  userId?: number;
  csrfToken?: string;
}

function generateSessionId(): string {
  return randomBytes(32).toString("hex");
}

function parseCookieValue(cookieHeader: string, name: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const eqIndex = part.indexOf("=");
    if (eqIndex === -1) continue;
    const key = part.slice(0, eqIndex).trim();
    const val = part.slice(eqIndex + 1).trim();
    if (key === name && val) return decodeURIComponent(val);
  }
  return null;
}

function buildSessionCookieHeader(sessionId: string): string {
  const secure = IS_PRODUCTION ? "Secure; " : "";
  return `user_session=${encodeURIComponent(sessionId)}; HttpOnly; ${secure}SameSite=Strict; ${COOKIE_DOMAIN}Max-Age=${SESSION_TTL_SECONDS}; Path=/`;
}

function buildClearCookieHeader(): string {
  const secure = IS_PRODUCTION ? "Secure; " : "";
  return `user_session=; HttpOnly; ${secure}SameSite=Strict; ${COOKIE_DOMAIN}Max-Age=0; Path=/`;
}

export class BunSession {
  private _id: string;
  private _data: SessionData;
  private _isNew: boolean;
  private _dirty: boolean;
  private _destroyed: boolean;

  private constructor(id: string, data: SessionData, isNew: boolean) {
    this._id = id;
    this._data = data;
    this._isNew = isNew;
    this._dirty = false;
    this._destroyed = false;
  }

  static create(): BunSession {
    return new BunSession(generateSessionId(), {}, true);
  }

  static async fromRequest(req: Request): Promise<BunSession> {
    const cookieHeader = req.headers.get("cookie") ?? "";
    const sessionId = parseCookieValue(cookieHeader, "user_session");
    if (!sessionId) return BunSession.create();

    const redis = getRedisClient();
    if (!redis?.isReady) return BunSession.create();

    try {
      const raw = await redis.get(`${REDIS_PREFIX}${sessionId}`);
      if (!raw) return BunSession.create();
      return new BunSession(sessionId, JSON.parse(raw) as SessionData, false);
    } catch {
      return BunSession.create();
    }
  }

  get id(): string { return this._id; }
  get isDestroyed(): boolean { return this._destroyed; }

  get userId(): number | undefined { return this._data.userId; }
  set userId(v: number | undefined) { this._data.userId = v; this._dirty = true; }

  get csrfToken(): string | undefined { return this._data.csrfToken; }
  set csrfToken(v: string | undefined) { this._data.csrfToken = v; this._dirty = true; }

  private get hasData(): boolean {
    return Object.values(this._data).some((v) => v !== undefined);
  }

  async save(): Promise<void> {
    if (this._destroyed) return;
    const redis = getRedisClient();
    if (!redis?.isReady) return;
    try {
      await redis.set(`${REDIS_PREFIX}${this._id}`, JSON.stringify(this._data), {
        EX: SESSION_TTL_SECONDS,
      });
      this._dirty = false;
      this._isNew = false;
    } catch (error) {
      console.error("BunSession.save failed:", error);
    }
  }

  async destroy(): Promise<void> {
    this._destroyed = true;
    const redis = getRedisClient();
    if (!redis?.isReady) return;
    try {
      await redis.del(`${REDIS_PREFIX}${this._id}`);
    } catch (error) {
      console.error("BunSession.destroy failed:", error);
    }
  }

  async regenerate(): Promise<void> {
    const oldId = this._id;
    this._id = generateSessionId();
    this._isNew = true;
    this._dirty = true;
    const redis = getRedisClient();
    if (!redis?.isReady) return;
    try {
      await redis.del(`${REDIS_PREFIX}${oldId}`);
    } catch {
      // best-effort delete of old key
    }
  }

  buildSetCookieHeader(): string | null {
    if (this._destroyed) return buildClearCookieHeader();
    // saveUninitialized: false — don\'t set a cookie for empty anonymous sessions
    if (this._isNew && !this.hasData) return null;
    return buildSessionCookieHeader(this._id);
  }
}
