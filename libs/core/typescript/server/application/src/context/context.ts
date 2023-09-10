/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { IEntity } from "@open-system/core-server-domain/types";
import { EnvManager } from "@open-system/core-shared-env";
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
  env ??= injector.get(EnvManager);

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

  const process = {
    correlationId: correlationId
      ? correlationId
      : utils.uniqueIdGenerator.generate(),
    requestId: requestId ? requestId : utils.uniqueIdGenerator.generate(),
    headers,
    startedAt: DateTime.current,
    startedBy: user.id
  };

  return {
    process,
    injector,
    user,
    system,
    utils,
    services: {}
  } as ServerContext<TEntities, TUser>;
};

export const extractCurrentProcess = (context: ServerContext) =>
  context?.process;

export const extractCorrelationId = (context: ServerContext) =>
  extractCurrentProcess(context)?.correlationId;

export const extractRequestId = (context: ServerContext) =>
  extractCurrentProcess(context)?.requestId;

export const extractRequestHeaders = (context: ServerContext) =>
  extractCurrentProcess(context)?.headers;

export const extractLogger = (context: ServerContext) => context?.utils?.logger;

export const extractUser = (context: ServerContext) => context?.user;

export const extractUserId = (context: ServerContext) =>
  extractUser(context)?.id;

export const extractSystem = (context: ServerContext) => context?.system;

export const extractSystemInfo = (context: ServerContext) =>
  context?.system?.info;

export const extractEnv = (context: ServerContext) =>
  extractSystem(context)?.env;

export const extractService = <
  TEntity extends IEntity = IEntity,
  TUser extends UserContext = UserContext
>(
  context: ServerContext<Array<TEntity>, TUser>,
  entityName: ServiceMappingIndex<TEntity>
): Service<TEntity> => context?.services?.[entityName] as Service<TEntity>;
