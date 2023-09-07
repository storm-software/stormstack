/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@open-system/core-server-domain";
import { EnvManager } from "@open-system/core-shared-env";
import { Service } from "@open-system/core-shared-injection";
import { JsonParser } from "@open-system/core-shared-serialization";
import {
  BaseErrorCode,
  BaseUtilityClass,
  DatabaseError,
  FieldValidationError,
  IncorrectTypeError,
  Logger,
  ModelValidationError,
  NotFoundError,
  isError,
  isValidInteger
} from "@open-system/core-shared-utilities";
import { map } from "radash";
import {
  AggregateParams,
  BatchLoadKey,
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  EntityKeys,
  FindCountParams,
  FindFirstParams,
  FindManyParams,
  FindUniqueParams,
  GroupByParams,
  QueryType,
  REPOSITORY_TOKEN,
  RepositoryOptions,
  SortOrder,
  UpdateManyParams,
  UpdateParams,
  UpsertParams,
  WhereUniqueParams
} from "../types";
import { RepositoryDataLoader } from "./repository-data-loader";

@Service(Repository)
export abstract class Repository<
  TEntity extends IEntity = IEntity
> extends BaseUtilityClass {
  /**
   * The name given to this `Repository` instance. Useful for APM tools.
   *
   * Is `null` if not set in the options passed through the constructor.
   */
  public name: string | null;

  public get options(): RepositoryOptions<TEntity> {
    return this._options;
  }

  protected dataLoader: RepositoryDataLoader<TEntity>;

  constructor(
    protected readonly logger: Logger,
    protected readonly env: EnvManager,
    private _options: RepositoryOptions<TEntity>
  ) {
    super(REPOSITORY_TOKEN);

    this.name = this._options.name;
    this.dataLoader = new RepositoryDataLoader<TEntity>(
      async (
        keys: Array<BatchLoadKey<TEntity>>
      ): Promise<Array<TEntity | TEntity[] | Error>> => {
        return map(keys, async (key: BatchLoadKey<TEntity>) => {
          key.take ??= isValidInteger(key.take, true)
            ? key.take
            : this.env.defaultQuerySize;
          key.orderBy ??= { id: SortOrder.asc } as Record<
            EntityKeys<TEntity>,
            string
          >;

          const handlerFn = this.routeDataLoading(key);
          if (isError(handlerFn)) {
            return handlerFn as Error;
          }

          const result = await handlerFn(key);
          if (isError(result)) {
            return new DatabaseError(this.name);
          }

          return result;
        });
      },
      this.logger,
      this._options
    );
  }

  public async findUnique(params: FindUniqueParams<TEntity>): Promise<TEntity> {
    this.logger.debug(
      `Finding unique record where - '${JsonParser.stringify(params.where)}'`
    );

    const result = await this.dataLoader.load({
      selector: { id: params.where.id as string },
      query: QueryType.FIND_UNIQUE
    });
    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new NotFoundError(this.name);
    }
    if (isError(result)) {
      throw result;
    }

    return Array.isArray(result) ? result[0] : result;
  }

  public async findFirst(params: FindFirstParams<TEntity>): Promise<TEntity> {
    this.logger.debug(
      `Finding first record - '${JsonParser.stringify(params)}'`
    );

    const result = await this.dataLoader.load({
      ...params,
      selector: params,
      query: QueryType.FIND_FIRST
    });
    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new NotFoundError(this.name);
    }
    if (isError(result)) {
      throw result;
    }

    return Array.isArray(result) ? result[0] : result;
  }

  public async findMany(params?: FindManyParams<TEntity>): Promise<TEntity[]> {
    this.logger.debug(
      `Finding many records - '${JsonParser.stringify(params)}'`
    );

    const result = await this.dataLoader.load({
      ...params,
      selector: params,
      query: QueryType.FIND_MANY
    });
    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw new NotFoundError(this.name);
    }
    if (isError(result)) {
      throw result;
    }

    return Array.isArray(result) ? result : [result];
  }

  public findCount(params?: FindCountParams<TEntity>): Promise<number> {
    this.logger.debug(
      `Finding many records - '${JsonParser.stringify(params)}'`
    );

    return this.innerFindCount(params);
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

  protected routeDataLoading = (
    key: BatchLoadKey<TEntity>
  ):
    | ((
        key: BatchLoadKey<TEntity>
      ) => Promise<TEntity[] | Error> | Promise<TEntity | Error>)
    | Error => {
    this.logger.debug(
      `Routing to appropriate select function in repository load`
    );

    /*const whereUniqueParams = key.selector.find(
      (selectorItem: SelectKeys<TEntity>) =>
        !!(selectorItem as WhereUniqueParams<TEntity>)?.["id"] &&
        typeof (selectorItem as WhereUniqueParams<TEntity>)?.["id"] === "string"
    ) as WhereUniqueParams<TEntity>;*/

    switch (key.query) {
      case QueryType.FIND_UNIQUE:
        if (!key.selector?.id) {
          return new ModelValidationError(
            [
              new FieldValidationError(
                ["where", "id"],
                BaseErrorCode.required_field_missing
              )
            ],
            BaseErrorCode.invalid_request
          );
        }

        return () =>
          this.innerFindUnique({
            where: {
              id: key.selector?.id as string
            } as WhereUniqueParams<TEntity>
          });

      case QueryType.FIND_FIRST:
        return this.innerFindFirst;
      case QueryType.FIND_MANY:
        return this.innerFindMany;
      case QueryType.AGGREGATE:
        return this.innerAggregate;
      default:
        return new IncorrectTypeError(
          `Invalid query type provided to repository - received: "${key.query}"`
        );
    }
  };

  protected abstract innerFindUnique: (
    params: FindUniqueParams<TEntity>
  ) => Promise<TEntity>;

  protected abstract innerFindFirst: (
    params: FindFirstParams<TEntity>
  ) => Promise<TEntity>;

  protected abstract innerFindMany: (
    params?: FindManyParams<TEntity>
  ) => Promise<TEntity[]>;

  protected abstract innerFindCount: (
    params?: FindCountParams<TEntity>
  ) => Promise<number>;

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
