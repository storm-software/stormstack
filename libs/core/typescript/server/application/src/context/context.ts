/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { IEntity } from "@open-system/core-server-domain/types";
import { Injector } from "@open-system/core-shared-injection";
import {
  ArrayElement,
  Logger,
  UniqueIdGenerator
} from "@open-system/core-shared-utilities";
import {
  CreateServerContextParams,
  ServerContext,
  UserContext,
  WhereParams,
  WhereUniqueParams
} from "../types";

export const createServerContext = <
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
  TCacheKeys = TSelectKeys,
  TServerContext extends ServerContext<
    TUser,
    TEntities,
    TNamespace,
    TEntityMapping,
    TSelectKeys,
    TCacheKeys
  > = ServerContext<
    TUser,
    TEntities,
    TNamespace,
    TEntityMapping,
    TSelectKeys,
    TCacheKeys
  >
>({
  correlationId,
  requestId,
  headers = {},
  environment,
  logger,
  env,
  user,
  injector,
  service
}: CreateServerContextParams<TUser>): TServerContext => {
  const _injector = injector ?? Injector;

  return {
    correlationId: correlationId ? correlationId : UniqueIdGenerator.generate(),
    requestId: requestId ? requestId : UniqueIdGenerator.generate(),
    headers,
    environment: environment ?? env.environment,
    logger: logger ?? _injector.get(Logger),
    env,
    injector: _injector,
    user: { id: UniqueIdGenerator.generate(), ...user } as TUser,
    service: {
      ...service,
      instanceId: service.instanceId ?? UniqueIdGenerator.generate()
    },
    repositories: {}
  } as TServerContext;
};

export const extractCorrelationId = (context?: ServerContext) =>
  context?.correlationId;

export const extractRequestId = (context?: ServerContext) => context?.requestId;

export const extractHeaders = (context?: ServerContext) => context?.headers;

export const extractLogger = (context?: ServerContext) => context?.logger;

export const extractUser = (context?: ServerContext) => context?.user;

export const extractUserId = (context?: ServerContext) => context?.user?.id;

export const extractService = (context?: ServerContext) => context?.service;
