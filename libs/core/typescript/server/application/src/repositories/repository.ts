/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@stormstack/core-server-domain";
import { EnvManager } from "@stormstack/core-shared-env";
import { Injected, Provider } from "@stormstack/core-shared-injection";
import { Logger } from "@stormstack/core-shared-logging/logger";
import { JsonParser } from "@stormstack/core-shared-serialization";
import {
  BaseErrorCode,
  BaseUtilityClass,
  FieldValidationError,
  IncorrectTypeError,
  ModelValidationError,
  NotFoundError,
  isError,
  isValidInteger
} from "@stormstack/core-shared-utilities";
import { map } from "radash";
import {
  BatchLoadKey,
  CreateParams,
  DeleteManyParams,
  DeleteParams,
  EntityKeys,
  FindCountParams,
  FindManyParams,
  FindUniqueParams,
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

@Provider(Repository)
export abstract class Repository<
  TEntity extends IEntity = IEntity
> extends BaseUtilityClass {
  protected dataLoader: RepositoryDataLoader<TEntity>;

  protected readonly options!: RepositoryOptions<TEntity>;
  protected readonly logger: Logger;

  constructor(
    @Injected(Logger) _logger: Logger,
    @Injected(EnvManager) _env: EnvManager
  ) {
    super(REPOSITORY_TOKEN);

    this.logger = _logger;

    this.dataLoader = new RepositoryDataLoader<TEntity>(
      async (
        keys: Array<BatchLoadKey<TEntity>>
      ): Promise<Array<TEntity | TEntity[] | Error>> => {
        return map(keys, async (key: BatchLoadKey<TEntity>) => {
          key.take ??= isValidInteger(key.take, true)
            ? key.take
            : _env.defaultQuerySize;
          key.orderBy ??= { id: SortOrder.asc } as Record<
            EntityKeys<TEntity>,
            string
          >;

          const handlerFn = this.routeDataLoading(key);
          if (isError(handlerFn)) {
            return handlerFn as Error;
          }

          return await handlerFn(key);
        });
      },
      this.logger,
      this.options,
      _env.serviceId
    );
  }

  public async findUnique(
    params: FindUniqueParams<TEntity>
  ): Promise<TEntity | Error> {
    this.logger.debug(
      `Finding unique record where - '${JsonParser.stringify(params.where)}'`
    );

    const result = await this.dataLoader.load({
      selector: { id: params.where.id as string },
      query: QueryType.FIND_UNIQUE
    });
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return new NotFoundError();
    }

    return Array.isArray(result) ? result[0] : result;
  }

  /*public async findFirst(
    params: FindFirstParams<TEntity>
  ): Promise<TEntity | Error> {
    this.logger.debug(
      `Finding first record - '${JsonParser.stringify(params)}'`
    );

    const result = await this.dataLoader.load({
      ...params,
      selector: params,
      query: QueryType.FIND_FIRST
    });
    if (!result || (Array.isArray(result) && result.length === 0)) {
      return new NotFoundError(this.name);
    }

    return Array.isArray(result) ? result[0] : result;
  }*/

  public async findMany(
    params: FindManyParams<TEntity>
  ): Promise<Array<TEntity | Error>> {
    this.logger.debug(
      `Finding many records - '${JsonParser.stringify(params)}'`
    );

    const result = await this.dataLoader.load({
      ...params,
      selector: params,
      query: QueryType.FIND_MANY
    });

    return Array.isArray(result) ? result : [result];
  }

  public findCount(params: FindCountParams<TEntity>): Promise<number> {
    this.logger.debug(
      `Finding the count of records - '${JsonParser.stringify(params)}'`
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

  /*public async aggregate(params: AggregateParams<TEntity>): Promise<TEntity[]> {
    this.logger.debug(`Aggregate record - '${JsonParser.stringify(params)}'`);

    return this.innerAggregate(params);
  }

  public async groupBy(params: GroupByParams<TEntity>): Promise<TEntity[]> {
    this.logger.debug(`Group By record - '${JsonParser.stringify(params)}'`);

    return this.innerGroupBy(params);
  }*/

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

      /*case QueryType.FIND_FIRST:
        return this.innerFindFirst;*/
      case QueryType.FIND_MANY:
        return this.innerFindMany;
      /*case QueryType.AGGREGATE:
        return this.innerAggregate;*/
      default:
        return new IncorrectTypeError(
          `Invalid query type provided to repository - received: "${key.query}"`
        );
    }
  };

  protected abstract innerFindUnique: (
    params: FindUniqueParams<TEntity>
  ) => Promise<TEntity>;

  /*protected abstract innerFindFirst: (
    params: FindFirstParams<TEntity>
  ) => Promise<TEntity>;*/

  protected abstract innerFindMany: (
    params: FindManyParams<TEntity>
  ) => Promise<TEntity[]>;

  protected abstract innerFindCount: (
    params: FindCountParams<TEntity>
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

  /*protected abstract innerAggregate: (
    params: AggregateParams<TEntity>
  ) => Promise<TEntity[]>;

  protected abstract innerGroupBy: (
    params: GroupByParams<TEntity>
  ) => Promise<TEntity[]>;*/
}
