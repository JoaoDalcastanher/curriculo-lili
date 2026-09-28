import { randomBytes } from "node:crypto";
import type { BunSession } from "./SessionService";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export class CsrfService {
  static generate(session: BunSession): string {
    const token = randomBytes(32).toString("hex");
    session.csrfToken = token;
    return token;
  }

  static validate(session: BunSession, headerToken: string | null): boolean {
    if (!session.csrfToken || !headerToken) return false;
    return session.csrfToken === headerToken;
  }

  static revoke(session: BunSession): void {
    session.csrfToken = undefined;
  }

  static isMutating(method: string): boolean {
    return MUTATING_METHODS.has(method.toUpperCase());
  }
}
