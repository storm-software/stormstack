/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@open-system/core-server-domain";
import { ServerEnvManager } from "@open-system/core-server-utilities/server-env-manager";
import { EnvManager, EnvironmentType } from "@open-system/core-shared-env";
import { Injector } from "@open-system/core-shared-injection/injector/injector";
import { Injector as InjectorType } from "@open-system/core-shared-injection/types";
import { ConsoleLogger, Logger } from "@open-system/core-shared-logging";
import { IJsonParser } from "@open-system/core-shared-serialization";
import {
  ArrayElement,
  DateTime,
  IUniqueIdGenerator,
  UniqueIdGenerator,
  uniqueIdGenerator
} from "@open-system/core-shared-utilities";
import { Service } from "../services";
import { EntityName, SYSTEM_TOKEN } from "../types";
import { getGlobalContextStore } from "./global-context-store";

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
  parser: IJsonParser;
  uniqueIdGenerator: IUniqueIdGenerator;
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

export type GlobalServerContext<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUtils extends UtilityContext = UtilityContext,
  TBindings = unknown
> = {
  isInitialized: boolean;
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
  parser?: IJsonParser;
  uniqueIdGenerator?: IUniqueIdGenerator;
  env?: Record<string, string | number | boolean | undefined> | undefined;
  injector?: InjectorType;
  serviceId?: SystemInfoContext["serviceId"];
  serviceName?: SystemInfoContext["name"];
  domainName?: SystemInfoContext["domainName"];
  serviceUrl?: SystemInfoContext["url"];
  serviceVersion?: SystemInfoContext["version"];
  instanceId?: SystemInfoContext["instanceId"];
  bindings?: TBindings;
};

export const createGlobalServerContextProxy = <
  TGlobalServerContext extends GlobalServerContext = GlobalServerContext
>(
  target: TGlobalServerContext
) => {
  return new Proxy<TGlobalServerContext>(target, {
    get: (_target, property: string) => {
      const store = getGlobalContextStore().getStore();
      const ctx: Record<string, any> = store?.get("context") || {};
      if (property === "isInitialized") {
        return !!ctx[property];
      } else {
        return ctx[property];
      }
    },
    set: (_target, property: string, newVal) => {
      const store = getGlobalContextStore().getStore();
      const ctx: Record<string, any> = store?.get("context") || {};
      ctx[property] = newVal;
      store?.set("context", ctx as TGlobalServerContext);
      return true;
    }
  });
};

export const createServerContext = <
  TGlobalServerContext extends GlobalServerContext = GlobalServerContext
>({
  environment,
  logger,
  parser,
  env: _env,
  injector: _injector,
  uniqueIdGenerator: _uniqueIdGenerator,
  serviceId,
  serviceName,
  serviceVersion,
  domainName,
  serviceUrl,
  instanceId,
  bindings
}: CreateServerContextParams<
  TGlobalServerContext["bindings"]
>): TGlobalServerContext => {
  const globalServerContext = getGlobalServerContext<TGlobalServerContext>();
  if (globalServerContext?.isInitialized) {
    return globalServerContext;
  }

  const injector = _injector ?? Injector;
  const utils = {
    logger: logger ?? injector.get(Logger) ?? ConsoleLogger,
    parser: parser ?? parser,
    uniqueIdGenerator: _uniqueIdGenerator ?? uniqueIdGenerator
  };

  const env: EnvManager = injector.isBound(EnvManager)
    ? injector.get(EnvManager)
    : new ServerEnvManager({ env: _env });
  const system = {
    environment: environment ?? env?.environment,
    info: {
      serviceId: serviceId ?? env?.serviceId,
      name: serviceName ?? env?.serviceName,
      version: serviceVersion ?? env?.serviceVersion,
      url: serviceUrl ?? env?.serviceUrl,
      domainName: domainName ?? env?.domainName,
      instanceId: instanceId ?? UniqueIdGenerator.generate()
    },
    startedAt: DateTime.current,
    startedBy: "System"
  };
  injector.bind(SYSTEM_TOKEN).toConstantValue(system);

  const newContext = {
    isInitialized: true,
    injector,
    system,
    env,
    utils,
    bindings,
    services: {}
  } as TGlobalServerContext;

  utils.logger.debug("Context Value: \n", newContext);

  return setGlobalServerContext<TGlobalServerContext>(newContext);
};

let _globalServerContext!: GlobalServerContext;
export const getGlobalServerContext = <
  TGlobalServerContext extends GlobalServerContext = GlobalServerContext
>(): TGlobalServerContext => {
  if (!_globalServerContext) {
    _globalServerContext = createGlobalServerContextProxy<TGlobalServerContext>(
      { isInitialized: false } as TGlobalServerContext
    );
  }

  return _globalServerContext as TGlobalServerContext;
};

/**
 * Set the contents of the global context object.
 *
 * This completely replaces the existing context values such as currentUser.
 *
 * If you wish to extend the context simply use the `context` object directly,
 * such as `context.magicNumber = 1`, or `setContext({ ...context, magicNumber: 1 })`
 */
export const setGlobalServerContext = <
  TGlobalServerContext extends GlobalServerContext = GlobalServerContext
>(
  newContext: TGlobalServerContext
): TGlobalServerContext => {
  // re-init the proxy against the new context object,
  // so things like `console.log(context)` is the actual object,
  // not one initialized earlier.
  _globalServerContext =
    createGlobalServerContextProxy<TGlobalServerContext>(newContext);

  // Replace the value of context stored in the current async store
  const store = getGlobalContextStore().getStore();
  store?.set("context", newContext);

  return _globalServerContext as TGlobalServerContext;
};
