import { Provider } from "@stormstack/core-shared-injection";
// import Redlock, { ResourceLockedError } from 'redlock';
import { Logger } from "@stormstack/core-shared-logging";
// import type { Redis } from './redis';
// import { REDIS_INSTANCE } from './redis';

export interface MutexLockOptions {
  signal: AbortSignal;
  /**
   * The lock duration in milliseconds. Beware that the duration
   * is how long is the lock held, not the acquire timeout.
   *
   * Note that the lock will be auto-extended by the duration all
   * the way until released (unlocked).
   *
   * @default 10_000
   */
  duration?: number;
  /**
   * How many times is the lock acquire retried before failing.
   *
   * @default 60
   */
  retries?: number;
  /**
   * How long to wait between lock acquire retries in milliseconds.
   *
   * The total lock timeout is then retries multiplied by the retryDelay.
   * For example: 60 (retries) * 1000ms (retryDelay) = 1min.
   *
   * @default 1000
   */
  retryDelay?: number;
  /**
   * The minimum remaining time in milliseconds on the lock before auto-extension.
   *
   * @default 500
   */
  autoExtendThreshold?: number;
}

@Provider()
export class Mutex {
  private redlock: any; // Redlock;

  constructor(private logger: Logger, redis: any /*Redis*/) {
    // this.logger = logger.child({ service: "Mutex" });
    this.redlock = {} as any; //new Redlock([redis]);
    this.redlock.on("error", err => {
      // these errors will be reported directly by the locking mechanism
      if (err instanceof Error /*ResourceLockedError*/) {
        return;
      }
      this.logger.error(err);
    });
  }

  public lock(
    id: string,
    {
      signal,
      duration = 10_000,
      retries = 60,
      retryDelay = 1000,
      autoExtendThreshold = 500
    }: MutexLockOptions
  ): Promise<() => void> {
    return new Promise((acquired, notAcquired) => {
      this.logger.debug("Acquiring lock (id=%s)", id);

      let unlock!: () => void;
      const l = Promise.race([
        new Promise<void>(resolve => {
          signal.addEventListener(
            "abort",
            () => {
              this.logger.warn("Lock aborted (id=%s)", id);
              // reject lock acquire
              notAcquired(new Error("Locking aborted"));
              // but resolve lock (so that redlock releases)
              resolve();
            },
            { once: true }
          );
        }),
        new Promise<void>(resolve => (unlock = resolve))
      ]);

      this.redlock
        .using(
          [id],
          duration,
          {
            retryCount: retries,
            retryDelay,
            automaticExtensionThreshold: autoExtendThreshold
          },
          autoExtensionFailSignal => {
            autoExtensionFailSignal.addEventListener(
              "abort",
              event => {
                // TODO: how to bubble this to the caller? the lock is basically released at this point
                this.logger.error(
                  "Lock auto-extension failed (id=%s, event=%s)",
                  id,
                  event
                );
              },
              { once: true }
            );
            this.logger.debug("Lock acquired (id=%s)", id);
            acquired(() => {
              this.logger.debug("Releasing lock (id=%s)", id);
              unlock();
            });
            return l;
          }
        )
        // nothing in the lock usage throws, so the error can only be a failed acquire
        .catch(notAcquired);
    });
  }

  public async perform<T>(
    id: string,
    opts: MutexLockOptions,
    action: () => T | Promise<T>
  ): Promise<T> {
    const unlock = await this.lock(id, opts);
    try {
      return await action();
    } finally {
      unlock();
    }
  }
}
