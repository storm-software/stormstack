/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity, WithMetadata } from "@open-system/core-server-domain/types";
import { Service } from "@open-system/core-shared-injection";
import {
  BaseUtilityClass,
  DateTime,
  Logger,
  NotFoundError,
  isError,
  isPromise
} from "@open-system/core-shared-utilities";
import { DatabaseError } from "@open-system/core-shared-utilities/errors";
import {
  EMPTY_STRING,
  MaybePromise
} from "@open-system/core-shared-utilities/types";
import { map } from "radash";
import { Repository } from "../repositories/repository";
import {
  CreateModelParams,
  FindManyParams,
  FindUniqueParams,
  MANAGER_TOKEN,
  ManyModelSelector,
  Model,
  ModelConnection,
  ModelEdge,
  UniqueModelSelector,
  UserContext,
  WhereUniqueParams
} from "../types";

@Service(Manager)
export abstract class Manager<
  TEntity extends IEntity = IEntity,
  TModel extends Model<TEntity> = Model<TEntity>,
  TRepository extends Repository<TEntity> = Repository<TEntity>
> extends BaseUtilityClass {
  constructor(
    protected readonly logger: Logger,
    protected repository: TRepository,
    protected readonly user: UserContext
  ) {
    super(MANAGER_TOKEN);

    this.repository.name = this.constructor.name.includes("Manager")
      ? this.constructor.name.replace("Manager", "")
      : this.constructor.name;
  }

  public getModel = async (
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
  };

  public getModelById = async (id: string): Promise<WithMetadata<TModel>> => {
    const entity = await this.repository.findUnique({
      where: { id } as WhereUniqueParams<TEntity>
    });
    if (!entity) {
      throw new NotFoundError(this.repository.name);
    }

    const model = this.mapEntityToModel(entity);
    if (isPromise(model)) {
      return this.addMetadata<TModel>(await model);
    }

    return this.addMetadata<TModel>(model);
  };

  public getModels = async (
    selector: ManyModelSelector<TModel>
  ): Promise<ModelConnection<WithMetadata<TModel>>> => {
    const results = await this.repository.findMany(
      selector as FindManyParams<TEntity>
    );
    if (!results || !Array.isArray(results) || results.length === 0) {
      throw new NotFoundError(this.repository.name);
    }
    const entities = this.handleErrorsIfExists(results);

    const edges = await map(entities, async (entity: TEntity) => {
      let model = this.mapEntityToModel(entity);
      if (isPromise(model)) {
        model = this.addMetadata<TModel>(await model);
      }

      return {
        __typename: `${this.repository.name}Edge`,
        node: this.addMetadata<TModel>(model),
        cursor: entity.id
      } as ModelEdge<TModel>;
    });

    const totalCount = await this.repository.findCount(selector);

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
    };
  };

  public createModel = async (
    params: CreateModelParams<TModel>
  ): Promise<TModel["id"]> => {
    let entity = this.mapModelToEntity(params.data);
    if (isPromise(entity)) {
      entity = await entity;
    }

    return this.repository.create({ data: entity });
  };

  public abstract mapEntityToModel: (entity: TEntity) => MaybePromise<TModel>;

  public abstract mapModelToEntity: (model: TModel) => MaybePromise<TEntity>;

  protected handleErrorsIfExists = (
    results: Array<TEntity | Error>
  ): Array<TEntity> => {
    const { errors, entities } = results.reduce(
      (ret: { errors: Error[]; entities: TEntity[] }, result) => {
        isError(result) ? ret.errors.push(result) : ret.entities.push(result);

        return ret;
      },
      { errors: [], entities: [] }
    );
    if (errors && errors.length > 0) {
      const databaseQueryError = new DatabaseError(
        this.repository.name ? `${this.repository.name} Select` : EMPTY_STRING
      );
      databaseQueryError.addIssues(errors);

      throw databaseQueryError;
    }

    return entities;
  };

  protected addMetadata = <TData = any>(
    data: TData,
    entity?: TEntity
  ): WithMetadata<TData> => {
    return {
      ...data,
      __typename: entity?.__typename ?? this.repository.name ?? EMPTY_STRING,
      sequence: entity?.sequence ?? 1,
      createdAt: entity?.createdAt ?? DateTime.current,
      createdBy: entity?.createdBy ?? this.user.id,
      updatedAt: entity?.updatedAt,
      updatedBy: entity?.updatedBy
    } as WithMetadata<TData>;
  };
}
