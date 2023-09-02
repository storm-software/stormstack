/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@open-system/core-server-domain";
import { Service } from "@open-system/core-shared-injection";
import { JsonParser } from "@open-system/core-shared-serialization";
import {
  BaseUtilityClass,
  Logger,
  isArrayLike,
  isEmpty
} from "@open-system/core-shared-utilities";
import {
  AggregateParams,
  BatchLoadFn,
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  FindFirstParams,
  FindManyParams,
  FindUniqueParams,
  GroupByParams,
  REPOSITORY_TOKEN,
  RepositoryOptions,
  UpdateManyParams,
  UpdateParams,
  UpsertParams,
  WhereParams,
  WhereUniqueParams
} from "../types";
import {
  Batch,
  getCurrentBatch,
  getValidBatchScheduleFn,
  getValidMaxBatchSize
} from "./repository-utilities";

@Service()
export abstract class Repository<
  TEntity extends IEntity = IEntity,
  TSelectKeys extends
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never> =
    | WhereParams<TEntity, keyof TEntity>
    | WhereUniqueParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TSelectKeys
> extends BaseUtilityClass {
  /**
   * The name given to this `Repository` instance. Useful for APM tools.
   *
   * Is `null` if not set in the options passed through the constructor.
   */
  public name: string | null;

  public cacheMap: Map<TCacheKeys, Promise<TEntity>>;

  public cacheKeyFn: (keys: TSelectKeys) => TCacheKeys;

  public batch: Batch<TEntity, TSelectKeys> | null;

  public get options(): RepositoryOptions<TEntity, TSelectKeys, TCacheKeys> {
    return this._options;
  }

  constructor(
    private readonly logger: Logger,
    private _options: RepositoryOptions<TEntity, TSelectKeys, TCacheKeys>
  ) {
    super(REPOSITORY_TOKEN);

    this.name = this._options.name;
    this.cacheMap = (this._options.cacheMap ||
      new Map<TCacheKeys, Promise<TEntity>>()) as any;
    this.cacheKeyFn =
      this._options.cacheKeyFn ||
      (((keys: TSelectKeys) => keys as unknown as TCacheKeys) as any);
    this.batch = null;

    if (!this._options.maxBatchSize) {
      this._options.maxBatchSize = getValidMaxBatchSize<
        TEntity,
        TSelectKeys,
        TCacheKeys
      >(this._options);
    }

    if (!this._options.batchScheduleFn) {
      this._options.batchScheduleFn = getValidBatchScheduleFn<
        TEntity,
        TSelectKeys,
        TCacheKeys
      >(this._options);
    }
  }

  public abstract batchLoadFn: BatchLoadFn<TEntity, TSelectKeys, TCacheKeys>;

  /**
   * Loads a key, returning a `Promise` for the value represented by that key.
   */
  public load = (
    key:
      | WhereParams<TEntity, keyof TEntity>
      | WhereUniqueParams<TEntity, keyof TEntity>
      | Record<string, never>
  ): Promise<TEntity> => {
    if (isEmpty(key)) {
      throw new TypeError(
        "The Repository.load() function must be called with a key value " +
          `but got: ${String(key)}.`
      );
    }

    const batch = getCurrentBatch(this);
    const cacheMap = this.cacheMap;
    const cacheKey = this.cacheKeyFn(key as TSelectKeys);

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
    batch.keys.push(key as TSelectKeys);
    const promise: Promise<TEntity> = new Promise((resolve, reject) => {
      batch.callbacks.push({ resolve, reject });
    });

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
    keys: Array<TSelectKeys>
  ): Promise<Array<TEntity | Error>> => {
    if (!isArrayLike(keys)) {
      keys = [];
      /*throw new TypeError(
        "The loader.loadMany() function must be called with Array<key> " +
          `but got: ${keys}.`
      );*/
    }

    // Support ArrayLike by using only minimal property access
    const loadPromises = [];
    for (const key in keys) {
      loadPromises.push(
        this.load(
          key as
            | WhereParams<TEntity, keyof TEntity>
            | WhereUniqueParams<TEntity, keyof TEntity>
        ).catch(error => error)
      );
    }

    return Promise.all(loadPromises);
  };

  /**
   * Clears the value at `key` from the cache, if it exists. Returns itself for
   * method chaining.
   */
  public clear = (key: TSelectKeys): this => {
    const cacheMap = this.cacheMap;
    if (cacheMap) {
      const cacheKey = this.cacheKeyFn(key);
      cacheMap.delete(cacheKey);
    }
    return this;
  };

  /**
   * Clears the entire cache. To be used when some event results in unknown
   * invalidations across this particular `DataLoader`. Returns itself for
   * method chaining.
   */
  public clearAll = (): this => {
    const cacheMap = this.cacheMap;
    if (cacheMap) {
      cacheMap.clear();
    }
    return this;
  };

  public async findUnique(params: FindUniqueParams<TEntity>): Promise<TEntity> {
    this.logger.debug(
      `Finding unique record where - '${JsonParser.stringify(params.where)}'`
    );

    return this.innerFindUnique(params);
  }

  public async findFirst(params: FindFirstParams<TEntity>): Promise<TEntity> {
    this.logger.debug(
      `Finding first record - '${JsonParser.stringify(params)}'`
    );

    return this.innerFindFirst(params);
  }

  public async findMany(params: FindManyParams<TEntity>): Promise<TEntity[]> {
    this.logger.debug(
      `Finding many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerFindMany(params);
  }

  public async create(params: CreateParams<TEntity>): Promise<TEntity["id"]> {
    this.logger.debug(`Creating record - '${JsonParser.stringify(params)}'`);

    return this.innerCreate(params);
  }

  public async delete(params: DeleteParams<TEntity>): Promise<TEntity["id"]> {
    this.logger.debug(`Deleting record - '${JsonParser.stringify(params)}'`);

    return this.innerDelete(params);
  }

  public async deleteMany(
    params: DeleteManyParams<TEntity>
  ): Promise<Array<TEntity["id"]>> {
    this.logger.debug(
      `Deleting many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerDeleteMany(params);
  }

  public async update(params: UpdateParams<TEntity>): Promise<TEntity["id"]> {
    this.logger.debug(`Updating record - '${JsonParser.stringify(params)}'`);

    return this.innerUpdate(params);
  }

  public async updateMany(
    params: UpdateManyParams<TEntity>
  ): Promise<Array<TEntity["id"]>> {
    this.logger.debug(
      `Updating many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerUpdateMany(params);
  }

  public async upsert(params: UpsertParams<TEntity>): Promise<TEntity["id"]> {
    this.logger.debug(`Upsert record - '${JsonParser.stringify(params)}'`);

    return this.innerUpsert(params);
  }

  public async aggregate(params: AggregateParams<TEntity>): Promise<TEntity[]> {
    this.logger.debug(`Aggregate record - '${JsonParser.stringify(params)}'`);

    return this.innerAggregate(params);
  }

  public async groupBy(params: GroupByParams<TEntity>): Promise<TEntity[]> {
    this.logger.debug(`Group By record - '${JsonParser.stringify(params)}'`);

    return this.innerGroupBy(params);
  }

  /**
   * Adds the provided key and value to the cache. If the key already
   * exists, no change is made. Returns itself for method chaining.
   *
   * To prime the cache with an error at a key, provide an Error instance.
   */
  public prime = (
    key: TSelectKeys,
    value: TEntity | Promise<TEntity> | Error
  ): this => {
    const cacheMap = this.cacheMap;
    if (cacheMap) {
      const cacheKey = this.cacheKeyFn(key);

      // Only add the key if it does not already exist.
      if (cacheMap.get(cacheKey) === undefined) {
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
        cacheMap.set(cacheKey, promise);
      }
    }
    return this;
  };

  protected abstract innerFindUnique: (
    params: FindUniqueParams<TEntity>
  ) => Promise<TEntity>;

  protected abstract innerFindFirst: (
    params: FindFirstParams<TEntity>
  ) => Promise<TEntity>;

  protected abstract innerFindMany: (
    params: FindFirstParams<TEntity>
  ) => Promise<TEntity[]>;

  protected abstract innerCreate: (
    params: CreateParams<TEntity>
  ) => Promise<TEntity["id"]>;

  protected abstract innerDelete: (
    params: DeleteParams<TEntity>
  ) => Promise<TEntity["id"]>;

  protected abstract innerDeleteMany: (
    params: DeleteManyParams<TEntity>
  ) => Promise<Array<TEntity["id"]>>;

  protected abstract innerUpdate: (
    params: UpdateParams<TEntity>
  ) => Promise<TEntity["id"]>;

  protected abstract innerUpdateMany: (
    params: UpdateManyParams<TEntity>
  ) => Promise<Array<TEntity["id"]>>;

  protected abstract innerUpsert: (
    params: UpsertParams<TEntity>
  ) => Promise<TEntity["id"]>;

  protected abstract innerAggregate: (
    params: AggregateParams<TEntity>
  ) => Promise<TEntity[]>;

  protected abstract innerGroupBy: (
    params: GroupByParams<TEntity>
  ) => Promise<TEntity[]>;
}
