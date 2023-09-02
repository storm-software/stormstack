/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@open-system/core-server-domain/types";
import {
  isArrayLike,
  isFunction,
  isObject
} from "@open-system/core-shared-utilities/common/type-checks";
import {
  CacheMap,
  RepositoryOptions,
  WhereParams,
  WhereUniqueParams
} from "../types";
import { Repository } from "./repository";

// Private: Describes a batch of requests
export type Batch<
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>
> = {
  hasDispatched: boolean;
  keys: Array<TSelectKeys>;
  callbacks: Array<{
    resolve: (value: TEntity) => void;
    reject: (error: Error) => void;
  }>;
  cacheHits?: Array<() => void>;
};

// Private: cached resolved Promise instance
let resolvedPromise!: Promise<any>;

// Private: Enqueue a Job to be executed after all "PromiseJobs" Jobs.
//
// ES6 JavaScript uses the concepts Job and JobQueue to schedule work to occur
// after the current execution context has completed:
// http://www.ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues
//
// Node.js uses the `process.nextTick` mechanism to implement the concept of a
// Job, maintaining a global FIFO JobQueue for all Jobs, which is flushed after
// the current call stack ends.
//
// When calling `then` on a Promise, it enqueues a Job on a specific
// "PromiseJobs" JobQueue which is flushed in Node as a single Job on the
// global JobQueue.
//
// DataLoader batches all loads which occur in a single frame of execution, but
// should include in the batch all loads which occur during the flushing of the
// "PromiseJobs" JobQueue after that same execution frame.
//
// In order to avoid the DataLoader dispatch Job occurring before "PromiseJobs",
// A Promise Job is created with the sole purpose of enqueuing a global Job,
// ensuring that it always occurs after "PromiseJobs" ends.
//
// Node.js's job queue is unique. Browsers do not have an equivalent mechanism
// for enqueuing a job to be performed after promise microtasks and before the
// next macrotask. For browser environments, a macrotask is used (via
// setImmediate or setTimeout) at a potential performance penalty.
export const enqueuePostPromiseJob =
  isObject(process) && isFunction(process.nextTick)
    ? (fn: () => void) => {
        if (!resolvedPromise) {
          resolvedPromise = Promise.resolve();
        }
        resolvedPromise.then(() => {
          process.nextTick(fn);
        });
      }
    : isFunction(setImmediate)
    ? (fn: () => void) => {
        setImmediate(fn);
      }
    : (fn: () => void) => {
        setTimeout(fn);
      };

// Private: Either returns the current batch, or creates and schedules a
// dispatch of a new batch for the given loader.
export const getCurrentBatch = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
>(
  repository: Repository<TEntity, TSelectKeys, TCacheKeys>
): Batch<TEntity, TSelectKeys> => {
  // If there is an existing batch which has not yet dispatched and is within
  // the limit of the batch size, then return it.
  const existingBatch = repository.batch;
  if (
    existingBatch !== null &&
    !existingBatch.hasDispatched &&
    existingBatch.keys.length < (repository.options.maxBatchSize ?? Infinity)
  ) {
    return existingBatch;
  }

  // Otherwise, create a new batch for this loader.
  const newBatch = { hasDispatched: false, keys: [], callbacks: [] };

  // Store it on the loader so it may be reused.
  repository.batch = newBatch;

  // Then schedule a task to dispatch this batch of requests.
  repository.options.batchScheduleFn &&
    repository.options.batchScheduleFn(() => {
      dispatchBatch<TEntity, TSelectKeys, TCacheKeys>(repository, newBatch);
    });

  return newBatch;
};

export const dispatchBatch = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
>(
  repository: Repository<TEntity, TSelectKeys, TCacheKeys>,
  batch: Batch<TEntity, TSelectKeys>
) => {
  // Mark this batch as having been dispatched.
  batch.hasDispatched = true;

  // If there's nothing to load, resolve any cache hits and return early.
  if (batch.keys.length === 0) {
    resolveCacheHits(batch);
    return;
  }

  // Call the provided batchLoadFn for this loader with the batch's keys and
  // with the loader as the `this` context.
  let batchPromise;
  try {
    batchPromise = repository.batchLoadFn(batch.keys);
  } catch (e) {
    return failedDispatch(
      repository,
      batch,
      new TypeError(
        "DataLoader must be constructed with a function which accepts " +
          "Array<key> and returns Promise<Array<value>>, but the function " +
          `errored synchronously: ${String(e)}.`
      )
    );
  }

  // Assert the expected response from batchLoadFn
  if (!batchPromise || typeof batchPromise.then !== "function") {
    return failedDispatch(
      repository,
      batch,
      new TypeError(
        "DataLoader must be constructed with a function which accepts " +
          "Array<key> and returns Promise<Array<value>>, but the function did " +
          `not return a Promise: ${String(batchPromise)}.`
      )
    );
  }

  // Await the resolution of the call to batchLoadFn.
  batchPromise
    .then((values: any) => {
      // Assert the expected resolution from batchLoadFn.
      if (!isArrayLike(values)) {
        throw new TypeError(
          "DataLoader must be constructed with a function which accepts " +
            "Array<key> and returns Promise<Array<value>>, but the function did " +
            `not return a Promise of an Array: ${String(values)}.`
        );
      }
      if (values.length !== batch.keys.length) {
        throw new TypeError(
          "DataLoader must be constructed with a function which accepts " +
            "Array<key> and returns Promise<Array<value>>, but the function did " +
            "not return a Promise of an Array of the same length as the Array " +
            "of keys." +
            `\n\nKeys:\n${String(batch.keys)}` +
            `\n\nValues:\n${String(values)}`
        );
      }

      // Resolve all cache hits in the same micro-task as freshly loaded values.
      resolveCacheHits(batch);

      // Step through values, resolving or rejecting each Promise in the batch.
      for (let i = 0; i < batch.callbacks.length; i++) {
        const value = values[i];
        if (value instanceof Error) {
          batch.callbacks[i].reject(value);
        } else {
          batch.callbacks[i].resolve(value);
        }
      }
    })
    .catch((error: Error) => {
      failedDispatch(repository, batch, error);
    });
};

// Private: do not cache individual loads if the entire batch dispatch fails,
// but still reject each request so they do not hang.
export const failedDispatch = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
>(
  repository: Repository<TEntity, TSelectKeys, TCacheKeys>,
  batch: Batch<TEntity, TSelectKeys>,
  error: Error
) => {
  // Cache hits are resolved, even though the batch failed.
  resolveCacheHits(batch);
  for (let i = 0; i < batch.keys.length; i++) {
    repository.clear(batch.keys[i]);
    batch.callbacks[i].reject(error);
  }
};

// Private: Resolves the Promises for any cache hits in this batch.
export const resolveCacheHits = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>
>(
  batch: Batch<TEntity, TSelectKeys>
) => {
  if (batch.cacheHits) {
    for (let i = 0; i < batch.cacheHits.length; i++) {
      batch.cacheHits[i]();
    }
  }
};

// Private: given the DataLoader's options, produce a valid max batch size.
export const getValidMaxBatchSize = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
>(
  options: RepositoryOptions<TEntity, TSelectKeys, TCacheKeys>
): number => {
  const shouldBatch = !options || options.batch !== false;
  if (!shouldBatch) {
    return 1;
  }
  const maxBatchSize = options && options.maxBatchSize;
  if (maxBatchSize === undefined) {
    return Infinity;
  }
  if (typeof maxBatchSize !== "number" || maxBatchSize < 1) {
    throw new TypeError(
      `maxBatchSize must be a positive number: ${maxBatchSize}`
    );
  }
  return maxBatchSize;
};

// Private
export const getValidBatchScheduleFn = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
>(
  options: RepositoryOptions<TEntity, TSelectKeys, TCacheKeys>
) => {
  const batchScheduleFn = options?.batchScheduleFn;
  if (batchScheduleFn === undefined) {
    return enqueuePostPromiseJob;
  }
  if (!isFunction(batchScheduleFn)) {
    throw new TypeError(
      `batchScheduleFn must be a function: ${batchScheduleFn}`
    );
  }

  return batchScheduleFn;
};

// Private: given the DataLoader's options, produce a cache key function.
export const getValidCacheKeyFn = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>,
  TCacheKeys = TSelectKeys
>(
  options?: RepositoryOptions<TEntity, TSelectKeys, TCacheKeys>
) => {
  const cacheKeyFn = options?.cacheKeyFn;
  if (cacheKeyFn === undefined) {
    return (key: TSelectKeys) => key as unknown as TCacheKeys;
  }
  if (!isFunction(cacheKeyFn)) {
    throw new TypeError(`cacheKeyFn must be a function: ${cacheKeyFn}`);
  }

  return cacheKeyFn;
};

// Private: given the DataLoader's options, produce a CacheMap to be used.
export const getValidCacheMap = <
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
>(
  options: RepositoryOptions<TEntity, keyof TEntity>
): CacheMap<TEntity, TSelectKeys, TCacheKeys> | null => {
  const shouldCache = !options || options.cache !== false;
  if (!shouldCache) {
    return null;
  }
  const cacheMap = options && options.cacheMap;
  if (cacheMap === undefined) {
    return new Map();
  }
  if (cacheMap !== null) {
    const cacheFunctions = ["get", "set", "delete", "clear"];
    const missingFunctions = cacheFunctions.filter(
      fnName => cacheMap && !isFunction(cacheMap.get(fnName as keyof TEntity))
    );
    if (missingFunctions.length !== 0) {
      throw new TypeError(
        "Custom cacheMap missing methods: " + missingFunctions.join(", ")
      );
    }
  }
  return cacheMap as CacheMap<TEntity, TSelectKeys, TCacheKeys>;
};

export const getValidName = <TEntity extends IEntity = IEntity>(
  options: RepositoryOptions<TEntity, keyof TEntity>
): string | null => {
  if (options && options.name) {
    return options.name;
  }

  return null;
};
