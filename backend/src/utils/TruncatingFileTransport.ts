import fs from "fs";
import { promises as fsp } from "fs";
import os from "os";
import path from "path";
import Transport from "winston-transport";

// triple-beam's MESSAGE is the registered symbol Symbol.for("message"); referencing it
// directly avoids depending on triple-beam's (untyped) module for a single symbol.
const MESSAGE = Symbol.for("message");

const DEFAULT_MAX_SIZE = 15 * 1024 * 1024; // 15MB
const TRUNCATE_KEEP_RATIO = 0.8; // Keep last 80%, remove first 20%
/** Minimum interval (ms) between truncation checks to avoid I/O on every write. */
const TRUNCATE_DEBOUNCE_MS = 30_000; // 30 seconds

/**
 * Transient filesystem errors — typically a temporary lock held by another
 * thread/process or antivirus/backup on Windows (surfaced as `UNKNOWN`). These
 * must not be treated as fatal: the stream is dropped and reopened on the next
 * write, so logging self-heals once the lock clears.
 */
const TRANSIENT_FS_CODES = new Set(["UNKNOWN", "EBUSY", "EPERM", "EACCES", "EMFILE", "ENFILE"]);

function isTransientFsError(err: unknown): boolean {
  const code = (err as NodeJS.ErrnoException | undefined)?.code;
  return code !== undefined && TRANSIENT_FS_CODES.has(code);
}

export interface TruncatingFileTransportOptions extends Transport.TransportStreamOptions {
  filename: string;
  maxSize?: number;
  eol?: string;
}

/**
 * Winston transport that writes to a file and truncates from the beginning
 * when the file exceeds maxSize, keeping only the most recent logs.
 */
export class TruncatingFileTransport extends Transport {
  private filePath: string;
  private maxSize: number;
  private eol: string;
  private stream: fs.WriteStream | null = null;
  private lastTruncateCheck = 0;
  private truncateInProgress = false;

  constructor(options: TruncatingFileTransportOptions) {
    super(options);

    this.filePath = path.resolve(options.filename);
    this.maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
    this.eol = options.eol ?? os.EOL;
  }

  override log(info: Record<string, unknown>, callback: () => void): void {
    setImmediate(() => this.emit("logged", info));

    const message = info[MESSAGE as unknown as keyof typeof info];
    const output =
      typeof message === "string" ? `${message}${this.eol}` : `${JSON.stringify(info)}${this.eol}`;

    // Fire-and-forget truncation (debounced) — don't block the write.
    this._truncateIfNeeded();

    this._ensureStream()
      .then(() => this._appendToFile(output, callback))
      .catch((err: Error) => {
        this.emit("error", err);
        callback();
      });
  }

  private _truncateIfNeeded(): void {
    const now = Date.now();
    if (this.truncateInProgress || now - this.lastTruncateCheck < TRUNCATE_DEBOUNCE_MS) {
      return;
    }
    this.lastTruncateCheck = now;
    this.truncateInProgress = true;

    this._doTruncate()
      .catch((err) => {
        this.emit("error", err);
      })
      .finally(() => {
        this.truncateInProgress = false;
      });
  }

  private async _doTruncate(): Promise<void> {
    try {
      const stat = await fsp.stat(this.filePath);
      if (stat.size <= this.maxSize) {
        return;
      }
    } catch {
      return; // File doesn't exist yet.
    }

    this._closeStream();

    try {
      const content = await fsp.readFile(this.filePath, "utf8");
      const targetSize = Math.floor(content.length * TRUNCATE_KEEP_RATIO);

      if (content.length <= targetSize) {
        return;
      }

      const dropCount = content.length - targetSize;
      const firstNewlineAfterCut = content.indexOf("\n", dropCount);
      const startIndex = firstNewlineAfterCut === -1 ? dropCount : firstNewlineAfterCut + 1;
      const truncatedContent = content.slice(startIndex);

      await fsp.writeFile(this.filePath, truncatedContent);
    } catch (err) {
      // A transient lock during truncation is harmless — skip this cycle and let
      // the next write reopen the file. Re-throw anything genuinely wrong.
      if (!isTransientFsError(err)) {
        throw err;
      }
    }
  }

  private _ensureStream(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.stream !== null) {
        resolve();
        return;
      }

      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      try {
        this.stream = fs.createWriteStream(this.filePath, {
          flags: "a",
          encoding: "utf8",
        });
        this.stream.on("error", (err) => this._handleFsError(err));
        resolve();
      } catch (err) {
        reject(err as Error);
      }
    });
  }

  private _appendToFile(output: string, callback: () => void): void {
    if (this.stream === null) {
      callback();
      return;
    }

    let invoked = false;
    const onComplete = (): void => {
      if (!invoked) {
        invoked = true;
        callback();
      }
    };

    const ok = this.stream.write(output, (err) => {
      if (err != null) {
        this._handleFsError(err);
      }
      onComplete();
    });

    if (!ok) {
      this.stream.once("drain", onComplete);
    }
  }

  /**
   * Handles a filesystem error from the write stream. Transient locks are not
   * fatal: drop the stream so the next write reopens the file. Only genuine
   * errors are surfaced (the logger listens and logs them to stderr).
   */
  private _handleFsError(err: NodeJS.ErrnoException): void {
    this._closeStream();
    if (!isTransientFsError(err)) {
      this.emit("error", err);
    }
  }

  private _closeStream(): void {
    if (this.stream !== null) {
      try {
        this.stream.end();
      } catch {
        // Ignore errors when closing.
      }
      this.stream = null;
    }
  }

  override close(): void {
    this._closeStream();
  }
}
