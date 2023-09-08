/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IEntity,
  WithMetadata,
  WithoutMetadata
} from "@open-system/core-server-domain/types";
import { Provider } from "@open-system/core-shared-injection";
import {
  BaseUtilityClass,
  DateTime,
  isError,
  isPromise
} from "@open-system/core-shared-utilities/common";
import {
  BaseError,
  DatabaseError,
  NotFoundError
} from "@open-system/core-shared-utilities/errors";
import { Logger } from "@open-system/core-shared-utilities/logging";
import {
  EMPTY_STRING,
  MaybePromise
} from "@open-system/core-shared-utilities/types";
import { Repository } from "../repositories/repository";
import {
  CountModelSelector,
  CreateModelParams,
  FindCountParams,
  FindManyParams,
  IModel,
  ManyModelSelector,
  SERVICE_TOKEN,
  UserContext,
  WhereUniqueParams
} from "../types";

@Provider(Service)
export abstract class Service<
  TEntity extends IEntity = IEntity,
  TModel extends WithMetadata<IModel<TEntity>> = TEntity
> extends BaseUtilityClass {
  /**
   * The name given to the records used by this `Service` instance.
   * Useful for APM tools, error messages, and logging in general.
   *
   * Meant to be over-written in the extending class.
   */
  public name: string;

  constructor(
    protected readonly logger: Logger,
    protected readonly repository: Repository<TEntity>,
    protected readonly user: UserContext
  ) {
    super(SERVICE_TOKEN);

    this.name ??= this.constructor.name.includes("Service")
      ? this.constructor.name.replace("Service", "")
      : this.constructor.name;
  }

  /*public get = async (
    selector: UniqueModelSelector<TModel>
  ): Promise<WithMetadata<TModel>> => {
    const entity = await this.repository.findUnique(
      selector as FindUniqueParams<TEntity>
    );
    if (!entity) {
      throw new NotFoundError(this.repository.name);
    }

    const model = this.mapEntityToModel(entity);
    if (isPromise(model)) {
      return this.addMetadata<TModel>(await model);
    }

    return this.addMetadata<TModel>(model);
  };*/

  public getById = async (id: string): Promise<TModel> => {
    const results = await this.repository.findUnique({
      where: { id } as WhereUniqueParams<TEntity>
    });

    return this.handleResult(results);
  };

  public get = async (
    selector: ManyModelSelector<TModel>
  ): Promise<Array<TModel>> => {
    const results = await this.repository.findMany(
      selector as FindManyParams<TEntity>
    );

    return this.handleResults(results);

    /*if (!results || !Array.isArray(results) || results.length === 0) {
      throw new NotFoundError(this.repository.name);
    }
    const entities = this.handleErrorsIfExists(results);

    return map(entities, async (entity: TEntity) => {
      const model = this.mapEntityToModel(entity);
      if (isPromise(model)) {
        return await model;
      }

      if (isPromise(model)) {
        model = this.addMetadata<TModel>(await model);
      }

      return {
        __typename: `${this.repository.name}Edge`,
        node: this.addMetadata<TModel>(model),
        cursor: entity.id
      } as ModelEdge<TModel>;
    });

    /*const totalCount = await this.repository.findCount(selector);

    return {
      __typename: `${this.repository.name}Connection`,
      edges,
      pageInfo: {
        __typename: "PageInfo",
        hasNextPage:
          edges.length === selector.take && edges.length < totalCount,
        hasPreviousPage: !!selector.cursor,
        startCursor: edges?.[0].cursor as string,
        endCursor: edges?.at(-1)?.cursor as string
      },
      totalCount
    };*/
  };

  public count = async (
    selector: CountModelSelector<TModel>
  ): Promise<number> => {
    const results = await this.repository.findCount(
      selector as FindCountParams<TEntity>
    );

    return results;
  };

  public create = async (
    params: CreateModelParams<TModel>
  ): Promise<TModel["id"]> => {
    let entity = this.mapModelToEntity(params.data as WithoutMetadata<TModel>);
    if (isPromise(entity)) {
      entity = await entity;
    }

    return this.repository.create({ data: entity });
  };

  public abstract mapEntityToModel: (entity: TEntity) => MaybePromise<TModel>;

  public abstract mapModelToEntity: (
    model: WithoutMetadata<TModel>
  ) => MaybePromise<TEntity>;

  protected addMetadata = <TData = any>(
    data: TData,
    entity?: TEntity
  ): WithMetadata<TData> => {
    return {
      ...data,
      __typename: entity?.__typename ?? this.name ?? EMPTY_STRING,
      sequence: entity?.sequence ?? 1,
      createdAt: entity?.createdAt ?? DateTime.current,
      createdBy: entity?.createdBy ?? this.user.id,
      updatedAt: entity?.updatedAt,
      updatedBy: entity?.updatedBy
    } as WithMetadata<TData>;
  };

  protected innerHandleResult = async (
    entity: TEntity
  ): Promise<WithMetadata<TModel>> => {
    let model = this.mapEntityToModel(entity);
    if (isPromise(model)) {
      model = await model;
    }

    return this.addMetadata<TModel>(model, entity);
  };

  private handleResult = (
    entity: TEntity | Error
  ): Promise<WithMetadata<TModel>> => {
    if (!entity) {
      throw new NotFoundError(this.name);
    }
    if (isError(entity)) {
      throw entity as Error;
    }

    return this.innerHandleResult(entity);
  };

  private handleResults = async (
    entities: Array<TEntity> | Error
  ): Promise<Array<WithMetadata<TModel>>> => {
    if (!entities || !Array.isArray(entities) || entities.length === 0) {
      throw new NotFoundError(this.name);
    }

    const { errors, results } = entities.reduce(
      (
        ret: {
          errors: BaseError[];
          results: Array<Promise<WithMetadata<TModel>>>;
        },
        result
      ) => {
        BaseError.isBaseError(result)
          ? ret.errors.push(result)
          : ret.results.push(this.innerHandleResult(result));

        return ret;
      },
      { errors: [], results: [] }
    );
    if (errors && errors.length > 0) {
      throw new DatabaseError(
        this.name ? `${this.name} Select` : EMPTY_STRING,
        errors
      );
    }

    return await Promise.all(results);
  };
}
