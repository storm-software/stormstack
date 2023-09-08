/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { IEntity, WithMetadata } from "@open-system/core-server-domain/types";
import { Injector } from "@open-system/core-shared-injection";
import { JSON_PARSER_SYMBOL } from "@open-system/core-shared-serialization";
import {
  DateTime,
  UniqueIdGenerator
} from "@open-system/core-shared-utilities/common";
import {
  ConsoleLogger,
  Logger
} from "@open-system/core-shared-utilities/logging";
import { Service } from "../services";
import {
  CreateServerContextParams,
  IModel,
  ServerContext,
  ServiceMappingIndex,
  UserContext
} from "../types";

export const createServerContext = <
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUser extends UserContext = UserContext
>({
  correlationId,
  requestId,
  headers = {},
  environment,
  logger,
  parser,
  env,
  user: _user,
  injector: _injector,
  uniqueIdGenerator,
  serviceId,
  serviceName,
  serviceVersion,
  domainName,
  serviceUrl,
  instanceId
}: CreateServerContextParams<TUser>): ServerContext<TEntities, TUser> => {
  const injector = _injector ?? Injector;

  const utils = {
    logger: logger ?? injector.get(Logger) ?? ConsoleLogger,
    parser: parser ?? injector.get(JSON_PARSER_SYMBOL),
    uniqueIdGenerator: uniqueIdGenerator ?? UniqueIdGenerator
  };

  const user = { id: utils.uniqueIdGenerator.generate(), ..._user };

  const system = {
    env,
    environment: environment ?? env.environment,
    info: {
      serviceId: serviceId ?? env.serviceId,
      name: serviceName ?? env.serviceName,
      version: serviceVersion ?? env.serviceVersion,
      url: serviceUrl ?? env.serviceUrl,
      domainName: domainName ?? env.domainName,
      instanceId: instanceId ?? utils.uniqueIdGenerator.generate()
    },
    startedAt: DateTime.current,
    startedBy: user.id
  };

  const request = {
    correlationId: correlationId
      ? correlationId
      : utils.uniqueIdGenerator.generate(),
    requestId: requestId ? requestId : utils.uniqueIdGenerator.generate(),
    headers,
    startedAt: DateTime.current,
    startedBy: user.id
  };

  return {
    request,
    injector,
    user,
    system,
    utils,
    services: {}
  } as ServerContext<TEntities, TUser>;
};

export const extractRequest = (context: ServerContext) => context?.request;

export const extractCorrelationId = (context: ServerContext) =>
  extractRequest(context)?.correlationId;

export const extractRequestId = (context: ServerContext) =>
  extractRequest(context)?.requestId;

export const extractRequestHeaders = (context: ServerContext) =>
  extractRequest(context)?.headers;

export const extractLogger = (context: ServerContext) => context?.utils?.logger;

export const extractUser = (context: ServerContext) => context?.user;

export const extractUserId = (context: ServerContext) =>
  extractUser(context)?.id;

export const extractSystem = (context: ServerContext) => context?.system;

export const extractSystemInfo = (context: ServerContext) =>
  context?.system?.info;

export const extractService = <
  TEntity extends IEntity = IEntity,
  TModel extends WithMetadata<IModel<TEntity>> = TEntity,
  TUser extends UserContext = UserContext
>(
  context: ServerContext<Array<TEntity>, TUser>,
  entityName: ServiceMappingIndex<TEntity>
): Service<TEntity, TModel> =>
  context?.services?.[entityName] as unknown as Service<TEntity, TModel>;
