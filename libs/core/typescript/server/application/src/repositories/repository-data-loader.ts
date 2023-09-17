/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@open-system/core-server-domain/types";
import { Logger } from "@open-system/core-shared-logging/logger";
import {
  BaseUtilityClass,
  isArrayLike,
  isEmpty
} from "@open-system/core-shared-utilities/common";
import { MemCacheClient } from "../providers/mem-cache-client";
import {
  BatchLoadFn,
  BatchLoadKey,
  REPOSITORY_DATA_LOADER_TOKEN,
  RepositoryOptions
} from "../types";
import {
  Batch,
  getCurrentBatch,
  getValidBatchScheduleFn,
  getValidMaxBatchSize
} from "./repository-utilities";

/**
 * This class serves as the internal **Open System** implementation
 * of the **DataLoader** utility class. This design comes from the well known
 * [DataLoader](https://github.com/graphql/dataloader) utility created at
 * Facebook.
 *
 * **Note:** The purpose of this utility is to allow for the batching and caching
 * of queries to the database. This is especially useful when a GraphQL query
 * is executed and multiple entities are requested. This utility will batch
 * the queries and execute them in a single database call. The goal of this is to solve the
 * infamous [N+1 problem](https://www.freecodecamp.org/news/n-plus-one-query-problem).
 */
export class RepositoryDataLoader<
  TEntity extends IEntity = IEntity
> extends BaseUtilityClass {
  protected cacheMap: MemCacheClient;

  public batch: Batch<TEntity> | null;
  public maxBatchSize?: number | undefined;
  public batchScheduleFn?: ((callback: () => void) => void) | undefined;

  constructor(
    public readonly batchLoadFn: BatchLoadFn<TEntity>,
    protected readonly logger: Logger,
    private readonly _options: RepositoryOptions<TEntity>,
    protected readonly instanceId?: string
  ) {
    super(REPOSITORY_DATA_LOADER_TOKEN);

    this.cacheMap = (this._options.cacheMap ||
      new MemCacheClient(instanceId ?? "default")) as any;
    this.batch = null;

    this.maxBatchSize =
      this._options.maxBatchSize ??
      getValidMaxBatchSize<TEntity>(this._options);

    this.batchScheduleFn =
      this._options.batchScheduleFn ??
      getValidBatchScheduleFn<TEntity>(this._options);
  }

  /**
   * Loads a key, returning a `Promise` for the value represented by that key.
   */
  public load = (key: BatchLoadKey<TEntity>): Promise<TEntity | TEntity[]> => {
    if (isEmpty(key)) {
      throw new TypeError(
        "The Repository.load() function must be called with a key value " +
          `but got: ${String(key)}.`
      );
    }

    const batch = getCurrentBatch(this);
    const cacheMap = this.cacheMap;

    const cacheKey = cacheMap.toCacheKey(key);

    // If caching and there is a cache-hit, return cached Promise.
    if (cacheMap) {
      const cachedPromise = cacheMap.get(cacheKey);
      if (cachedPromise) {
        const cacheHits = batch.cacheHits || (batch.cacheHits = []);
        return new Promise(resolve => {
          cacheHits.push(() => {
            resolve(cachedPromise);
          });
        });
      }
    }

    // Otherwise, produce a new Promise for this key, and enqueue it to be
    // dispatched along with the current batch.
    batch.keys.push(key);
    const promise: Promise<TEntity | TEntity[]> = new Promise(
      (resolve, reject) => {
        batch.callbacks.push({ resolve, reject });
      }
    );

    // If caching, cache this promise.
    if (cacheMap) {
      cacheMap.set(cacheKey, promise);
    }

    return promise;
  };

  /**
   * Loads multiple keys, promising an array of values:
   *
   *     var [ a, b ] = await myLoader.loadMany([ 'a', 'b' ]);
   *
   * This is similar to the more verbose:
   *
   *     var [ a, b ] = await Promise.all([
   *       myLoader.load('a'),
   *       myLoader.load('b')
   *     ]);
   *
   * However it is different in the case where any load fails. Where
   * Promise.all() would reject, loadMany() always resolves, however each result
   * is either a value or an Error instance.
   *
   *     var [ a, b, c ] = await myLoader.loadMany([ 'a', 'b', 'badkey' ]);
   *     // c instanceof Error
   *
   */
  public loadMany = (
    keys: Array<BatchLoadKey<TEntity>>
  ): Promise<Array<TEntity | Error>> => {
    if (!isArrayLike(keys)) {
      throw new TypeError(
        "The parameters passed into the `loadMany` function must be an array.\nIf only a single query execution is needed, please use the `load` function instead."
      );
    }

    // Support ArrayLike by using only minimal property access
    const loadPromises = [];
    for (const key of keys) {
      loadPromises.push(this.load(key).catch(error => error));
    }

    return Promise.all(loadPromises);
  };

  /**
   * Clears the value at `key` from the cache, if it exists. Returns itself for
   * method chaining.
   */
  public clear = async (key: BatchLoadKey<TEntity>): Promise<this> => {
    const cacheMap = this.cacheMap;
    if (cacheMap) {
      await cacheMap.del(cacheMap.toCacheKey(key));
    }
    return this;
  };

  /**
   * Clears the entire cache. To be used when some event results in unknown
   * invalidations across this particular `DataLoader`. Returns itself for
   * method chaining.
   */
  public clearAll = async (): Promise<this> => {
    const cacheMap = this.cacheMap;
    if (cacheMap) {
      await cacheMap.delAll();
    }
    return this;
  };

  /**
   * Adds the provided key and value to the cache. If the key already
   * exists, no change is made. Returns itself for method chaining.
   *
   * To prime the cache with an error at a key, provide an Error instance.
   */
  public prime = (
    key: BatchLoadKey<TEntity>,
    value: TEntity[] | Promise<TEntity[]> | TEntity | Promise<TEntity> | Error
  ): this => {
    const cacheMap = this.cacheMap;
    if (cacheMap) {
      // Only add the key if it does not already exist.
      if (cacheMap.get(cacheMap.toCacheKey(key)) === undefined) {
        // Cache a rejected promise if the value is an Error, in order to match
        // the behavior of load(key).
        let promise;
        if (value instanceof Error) {
          promise = Promise.reject(value);
          // Since this is a case where an Error is intentionally being primed
          // for a given key, we want to disable unhandled promise rejection.
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          promise.catch(() => {});
        } else {
          promise = Promise.resolve(value);
        }

        cacheMap.set(cacheMap.toCacheKey(key), promise);
      }
    }
    return this;
  };
}
