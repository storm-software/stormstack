/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { IAggregateRoot } from "@open-system/core-server-domain";
import { IEntity } from "@open-system/core-server-domain/types";
import { EnvironmentType } from "@open-system/core-shared-env";
import { EnvManager } from "@open-system/core-shared-env/env-manager";
import { Injector } from "@open-system/core-shared-injection/types";
import { ArrayElement, Logger } from "@open-system/core-shared-utilities";
import { ICommand } from "./commands";
import { Repository } from "./repositories";

export const MESSAGE_BROKER_TOKEN = Symbol.for("MESSAGE_BROKER_TOKEN");
export const EVENT_PUBLISHER_TOKEN = Symbol.for("EVENT_PUBLISHER_TOKEN");
export const EVENT_STORE_TOKEN = Symbol.for("EVENT_STORE_TOKEN");
export const REPOSITORY_TOKEN = Symbol.for("REPOSITORY_TOKEN");

export type StringFilter = {
  equals?: string;
  in?: string[];
  notIn?: string[];
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  not?: string;
};

export type DateTimeFilter = {
  equals?: Date | string;
  in?: Date[] | string[];
  notIn?: Date[] | string[];
  lt?: Date | string;
  lte?: Date | string;
  gt?: Date | string;
  gte?: Date | string;
  not?: Date | string;
};

export type DateTimeNullableFilter = {
  equals?: Date | string | null;
  in?: Date[] | string[] | null;
  notIn?: Date[] | string[] | null;
  lt?: Date | string;
  lte?: Date | string;
  gt?: Date | string;
  gte?: Date | string;
  not?: Date | string | null;
};

export type StringNullableFilter = {
  equals?: string | null;
  in?: string[] | null;
  notIn?: string[] | null;
  lt?: string;
  lte?: string;
  gt?: string;
  gte?: string;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  not?: string | null;
};

export type BoolFilter = {
  equals?: boolean;
  not?: boolean;
};

export type BoolNullableFilter = {
  equals?: boolean | null;
  not?: boolean | null;
};

export type NumberFilter = {
  equals?: number;
  in?: number[];
  notIn?: number[];
  between?: number[];
  notBetween?: number[];
  lt?: number;
  lte?: number;
  gt?: number;
  gte?: number;
  not?: number[];
};

export type NumberNullableFilter = {
  equals?: number | null;
  in?: number[] | null;
  notIn?: number[] | null;
  between?: number[] | null;
  notBetween?: number[] | null;
  lt?: number | null;
  lte?: number | null;
  gt?: number | null;
  gte?: number | null;
  not?: number[] | null;
};

export const SortOrder = {
  asc: "asc",
  desc: "desc"
};

export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];

export type AggregateFieldParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = Partial<Record<TKey, true>>;

export type AggregateCountFieldParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = AggregateFieldParams<TData, TKey> & {
  _all?: true;
};

export type WhereParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = Partial<
  Record<TKey, StringNullableFilter | DateTimeNullableFilter | BoolFilter>
> & {
  AND?: WhereParams<TData, TKey> | WhereParams<TData, TKey>[];
  OR?: WhereParams<TData, TKey>[];
  NOT?: WhereParams<TData, TKey> | WhereParams<TData, TKey>[];
};

export type WhereUniqueParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = Partial<WhereParams<TData, TKey>> & {
  id?: string;
};

export type FindUniqueParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  where: WhereUniqueParams<TData, TKey>;
};

export type FindFirstParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  where?: WhereParams<TData, TKey>;
  orderBy?: Record<TKey, SortOrder> | Array<Record<TKey, SortOrder>>;
  cursor?: WhereUniqueParams<TData, TKey>;
  take?: number;
  skip?: number;
  distinct?: TKey | Array<TKey>;
};

export type FindManyParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  where?: WhereParams<TData, TKey>;
  orderBy?: Record<TKey, SortOrder> | Array<Record<TKey, SortOrder>>;
  cursor?: WhereUniqueParams<TData, TKey>;
  take?: number;
  skip?: number;
  distinct?: TKey | Array<TKey>;
};

export type CreateParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  data: Partial<TData>;
};

export type UpdateParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  data: Partial<TData>;
  where: WhereUniqueParams<TData, TKey>;
};

export type UpdateManyParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  data: Partial<TData>;
  where?: WhereUniqueParams<TData, TKey>;
};

export type UpsertParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  create: CreateParams<TData, TKey>["data"];
  update: UpdateParams<TData, TKey>["data"];
  where: WhereUniqueParams<TData, TKey>;
};

export type DeleteParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  where: WhereUniqueParams<TData, TKey>;
};

export type DeleteManyParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  where?: WhereParams<TData, TKey>;
};

export type AggregateParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  where?: WhereParams<TData, TKey>;
  orderBy?: Record<TKey, SortOrder> | Array<Record<TKey, SortOrder>>;
  cursor?: WhereUniqueParams<TData, TKey>;
  take?: number;
  skip?: number;
  distinct?: TKey | Array<TKey>;
  _count?: AggregateCountFieldParams<TData, TKey>;
  _min?: AggregateFieldParams<TData, TKey>;
  _max?: AggregateFieldParams<TData, TKey>;
};

export type GroupByParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: Partial<Record<TKey, boolean>>;
  where?: WhereParams<TData, TKey>;
  orderBy?: Record<TKey, SortOrder> | Array<Record<TKey, SortOrder>>;
  cursor?: WhereUniqueParams<TData, TKey>;
  take?: number;
  skip?: number;
  distinct?: TKey | Array<TKey>;
  _count?: AggregateCountFieldParams<TData, TKey>;
  _min?: AggregateFieldParams<TData, TKey>;
  _max?: AggregateFieldParams<TData, TKey>;
};

export type CountParams<
  TData extends IEntity = IEntity,
  TKey extends keyof TData = keyof TData
> = {
  select?: AggregateCountFieldParams<TData, TKey> | true;
};

export type UserContext<TContext = {}> = Record<string, any> &
  TContext & {
    id: string;
    name?: string;
    email?: string;
  };

export type FactoriesContext = {
  aggregate: <TAggregate extends IAggregateRoot = IAggregateRoot>(
    request: any,
    sourceId: string,
    correlationId: string,
    userId: string
  ) => TAggregate;
  command: <TRequest>(
    commandId: string,
    version: number,
    request: TRequest
  ) => ICommand<TRequest>;
};

export type ServiceContext = {
  serviceId: string;
  serviceName: string;
  serviceUrl: string;
  instanceId: string;
};

export type BaseServerContext<
  TUser extends UserContext = UserContext,
  TFactories extends FactoriesContext = FactoriesContext
> = {
  correlationId: string;
  requestId: string;
  headers: Record<string, string | string[] | undefined>;
  environment: EnvironmentType;
  logger: Logger;
  user: UserContext<TUser>;
  env: EnvManager;
  factories?: TFactories;
  injector: Injector;
};

export type ServerContext<
  TUser extends UserContext = UserContext,
  TEntities extends Array<IEntity> = Array<IEntity>,
  TNamespace extends ArrayElement<TEntities>["__typename"] = ArrayElement<TEntities>["__typename"],
  TEntityMapping extends Record<TNamespace, ArrayElement<TEntities>> = Record<
    TNamespace,
    ArrayElement<TEntities>
  >,
  TSelectKeys extends Record<
    TNamespace,
    | WhereParams<TEntityMapping[TNamespace], keyof TEntityMapping[TNamespace]>
    | WhereUniqueParams<
        TEntityMapping[TNamespace],
        keyof TEntityMapping[TNamespace]
      >
    | Record<string, never>
  > = Record<
    TNamespace,
    | WhereParams<TEntityMapping[TNamespace], keyof TEntityMapping[TNamespace]>
    | WhereUniqueParams<
        TEntityMapping[TNamespace],
        keyof TEntityMapping[TNamespace]
      >
    | Record<string, never>
  >,
  TCacheKeys = TSelectKeys
> = BaseServerContext<TUser> & {
  service: ServiceContext;
  repositories: Record<
    TNamespace,
    Repository<TEntityMapping[TNamespace], TSelectKeys[TNamespace], TCacheKeys>
  >;
};

/*export type EventSourcedServerContext<TUser extends UserContext = UserContext> =
  ServerContext<TUser> & {
    eventStore: EventStore;
    snapshotStore: any;
    eventPublisher: EventPublisher;
  };*/

export type CreateServerContextParams<TUser extends UserContext = UserContext> =
  {
    correlationId?: string;
    requestId?: string;
    headers?: Record<string, string | string[] | undefined>;
    environment?: EnvironmentType;
    logger?: Logger;
    user?: TUser;
    env: EnvManager;
    injector: Injector;
    service: Omit<ServiceContext, "instanceId"> &
      Partial<Pick<ServiceContext, "instanceId">>;
  };

/**
 * A Function, which when given an Array of keys, returns a Promise of an Array
 * of values or Errors.
 */
export type BatchLoadFn<
  TEntity extends IEntity = IEntity,
  TKeys =
    | WhereUniqueParams<TEntity, keyof TEntity>
    | WhereParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCache = TKeys
> = (keys: Array<TKeys>) => Promise<Array<TEntity | Error>>;

/**
 * Optionally turn off batching or caching or provide a cache key function or a
 * custom cache instance.
 */
export type RepositoryOptions<
  TEntity extends IEntity = IEntity,
  TKeys =
    | WhereUniqueParams<TEntity, keyof TEntity>
    | WhereParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TKeys
> = {
  name: string;
  batch?: boolean;
  maxBatchSize?: number;
  batchScheduleFn?: (callback: () => void) => void;
  cache?: boolean;
  cacheKeyFn?: (key: TKeys) => TCacheKeys;
  cacheMap?: CacheMap<TEntity, TKeys, TCacheKeys> | null;
};

/**
 * If a custom cache is provided, it must be of this type (a subset of ES6 Map).
 */
export type CacheMap<
  TEntity extends IEntity = IEntity,
  TKeys =
    | WhereUniqueParams<TEntity, keyof TEntity>
    | WhereParams<TEntity, keyof TEntity>
    | Record<string, never>,
  TCacheKeys = TKeys
> = {
  get(key: TCacheKeys): TEntity | void;
  set(key: TCacheKeys, value: TEntity): any;
  delete(key: TCacheKeys): any;
  clear(): any;
};
