// All cron retry logic goes through runWithRetry.
// No cron job implements its own retry loop (ADR-0011).

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

export function isDatabaseSleepError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  const code =
    error instanceof Error ? (error as NodeJS.ErrnoException).code : "";
  const lowerMessage = message.toLowerCase();

  return (
    code === "ECONNREFUSED" ||
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "PROTOCOL_CONNECTION_LOST" ||
    lowerMessage.includes("connection lost") ||
    lowerMessage.includes("connection refused") ||
    lowerMessage.includes("connection terminated") ||
    lowerMessage.includes("connect econnrefused") ||
    lowerMessage.includes("connect econnreset") ||
    lowerMessage.includes("connect etimedout")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runWithRetry(
  fn: () => Promise<void>,
  jobName: string,
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await fn();
      return;
    } catch (error) {
      lastError = error;
      const shouldRetry = attempt < MAX_RETRIES && isDatabaseSleepError(error);

      if (shouldRetry) {
        const delayMs = RETRY_DELAY_MS * attempt;
        console.warn(
          `${jobName} attempt ${attempt}/${MAX_RETRIES} failed (database may be sleeping). Retrying in ${delayMs / 1000}s...`,
          error,
        );
        await sleep(delayMs);
      } else {
        throw error;
      }
    }
  }

  throw lastError;
}
