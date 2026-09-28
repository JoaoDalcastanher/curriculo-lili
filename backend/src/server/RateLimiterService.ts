interface Entry {
  count: number;
  resetAt: number;
}

export class RateLimiterService {
  private readonly store = new Map<string, Entry>();
  private readonly max: number;
  private readonly windowMs: number;

  constructor(max: number, windowMs: number) {
    this.max = max;
    this.windowMs = windowMs;
  }

  check(key: string): boolean {
    const now = Date.now();
    const entry = this.store.get(key);

    if (!entry || now > entry.resetAt) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.max) return false;

    entry.count++;
    return true;
  }
}
