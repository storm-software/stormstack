/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@open-system/core-server-domain";
import { EnvManager, EnvironmentType } from "@open-system/core-shared-env";
import { Injector } from "@open-system/core-shared-injection/injector";
import { Injector as InjectorType } from "@open-system/core-shared-injection/types";
import {
  JSON_PARSER_SYMBOL,
  JsonParser
} from "@open-system/core-shared-serialization";
import {
  ArrayElement,
  ConsoleLogger,
  DateTime,
  Logger,
  UniqueIdGenerator
} from "@open-system/core-shared-utilities";
// import { ICommand } from "../commands";
import { Service } from "../services";
import { EntityName, SYSTEM_TOKEN } from "../types";

/*export type FactoriesContext = {
  aggregate: <TAggregate extends IAggregateRoot = IAggregateRoot>(
    request: any,
    sourceId: string,
    correlationId: string,
    userId: string
  ) => TAggregate;
  command: <TRequest>(
    commandId: string,
    version: number,
    request: any
  ) => ICommand<TRequest>;
};*/

export type UtilityContext = {
  logger: Logger;
  parser: typeof JsonParser;
  uniqueIdGenerator: typeof UniqueIdGenerator;
};

export type SystemInfoContext = {
  serviceId: string;
  name: string;
  url: string;
  version: string;
  instanceId: string;
  domainName: string;
};

export type SystemContext = {
  info: SystemInfoContext;
  environment: EnvironmentType;
  startedAt: DateTime;
  startedBy: string;
};

export type ServiceMappingIndex<TEntity extends IEntity = IEntity> =
  Uncapitalize<EntityName<TEntity>>;

export type ServiceMapping<TEntities extends Array<IEntity> = Array<IEntity>> =
  Record<
    ServiceMappingIndex<ArrayElement<TEntities>>,
    Service<ArrayElement<TEntities>>
  >;

export type InitialServerContext<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUtils extends UtilityContext = UtilityContext,
  TBindings = unknown
> = {
  system: SystemContext;
  utils: TUtils;
  env: EnvManager;
  injector: InjectorType;
  services: ServiceMapping<TEntities>;
  bindings?: TBindings;
};

export type CreateServerContextParams<TBindings = unknown> = {
  environment?: EnvironmentType;
  logger?: Logger;
  parser?: typeof JsonParser;
  uniqueIdGenerator?: typeof UniqueIdGenerator;
  env?: EnvManager;
  injector?: InjectorType;
  serviceId?: SystemInfoContext["serviceId"];
  serviceName?: SystemInfoContext["name"];
  domainName?: SystemInfoContext["domainName"];
  serviceUrl?: SystemInfoContext["url"];
  serviceVersion?: SystemInfoContext["version"];
  instanceId?: SystemInfoContext["instanceId"];
  bindings?: TBindings;
};

export const createServerContext = <
  TInitialServerContext extends InitialServerContext = InitialServerContext
>({
  environment,
  logger,
  parser,
  env,
  injector: _injector,
  uniqueIdGenerator,
  serviceId,
  serviceName,
  serviceVersion,
  domainName,
  serviceUrl,
  instanceId,
  bindings
}: CreateServerContextParams<
  TInitialServerContext["bindings"]
>): TInitialServerContext => {
  const injector = _injector ?? Injector;

  const utils = {
    logger: logger ?? injector.get(Logger) ?? ConsoleLogger,
    parser: parser ?? injector.get(JSON_PARSER_SYMBOL),
    uniqueIdGenerator: uniqueIdGenerator ?? UniqueIdGenerator
  };

  env ??= injector.get(EnvManager);
  const system = {
    environment: environment ?? env?.environment,
    info: {
      serviceId: serviceId ?? env?.serviceId,
      name: serviceName ?? env?.serviceName,
      version: serviceVersion ?? env?.serviceVersion,
      url: serviceUrl ?? env?.serviceUrl,
      domainName: domainName ?? env?.domainName,
      instanceId: instanceId ?? utils.uniqueIdGenerator.generate()
    },
    startedAt: DateTime.current,
    startedBy: "System"
  };
  injector.bind(SYSTEM_TOKEN).toConstantValue(system);

  return {
    injector,
    system,
    env,
    utils,
    bindings,
    services: {}
  } as TInitialServerContext;
};
