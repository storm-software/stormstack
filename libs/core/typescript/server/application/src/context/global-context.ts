/* eslint-disable @typescript-eslint/no-explicit-any */
import { IEntity } from "@stormstack/core-server-domain";
import { ServerEnvManager } from "@stormstack/core-server-utilities/server-env-manager";
import { EnvManager, EnvironmentType } from "@stormstack/core-shared-env";
import { createInjectorProxy } from "@stormstack/core-shared-injection/injector/injector-proxy";
import { InjectorProxy } from "@stormstack/core-shared-injection/types";
import { ConsoleLogger, Logger } from "@stormstack/core-shared-logging";
import { IJsonParser } from "@stormstack/core-shared-serialization";
import {
  ArrayElement,
  DateTime,
  UniqueIdGenerator
} from "@stormstack/core-shared-utilities";
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

export type GlobalContext<
  TEntities extends Array<IEntity> = Array<IEntity>,
  TUtils extends UtilityContext = UtilityContext,
  TBindings = unknown
> = {
  isInitialized: boolean;
  system: SystemContext;
  utils: TUtils;
  env: EnvManager;
  injector: InjectorProxy;
  services: ServiceMapping<TEntities>;
  bindings?: TBindings;
};

export type CreateGlobalContextParams<TBindings = unknown> = {
  environment?: EnvironmentType;
  logger?: Logger;
  parser?: IJsonParser;
  env?: Record<string, string | number | boolean | undefined> | undefined;
  injector?: InjectorProxy;
  serviceId?: SystemInfoContext["serviceId"];
  serviceName?: SystemInfoContext["name"];
  domainName?: SystemInfoContext["domainName"];
  serviceUrl?: SystemInfoContext["url"];
  serviceVersion?: SystemInfoContext["version"];
  instanceId?: SystemInfoContext["instanceId"];
  bindings?: TBindings;
};

export const createGlobalContextProxy = <
  TGlobalContext extends GlobalContext = GlobalContext
>(
  target: TGlobalContext
) => {
  return new Proxy<TGlobalContext>(target, {
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
      store?.set("context", ctx as TGlobalContext);
      return true;
    }
  });
};

export const createGlobalContext = <
  TGlobalContext extends GlobalContext = GlobalContext
>({
  environment,
  logger,
  parser,
  env: _env,
  injector: _injector,
  serviceId,
  serviceName,
  serviceVersion,
  domainName,
  serviceUrl,
  instanceId,
  bindings
}: CreateGlobalContextParams<
  TGlobalContext["bindings"]
> = {}): TGlobalContext => {
  const globalContext = getGlobalContext<TGlobalContext>();
  if (globalContext?.isInitialized) {
    return globalContext;
  }

  const injector = _injector ?? createInjectorProxy();
  const utils = {
    logger: logger ?? injector.get<Logger>(Logger) ?? ConsoleLogger,
    parser: parser ?? parser
  };

  const env: EnvManager =
    !_env && injector.isBound(EnvManager)
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
      instanceId: instanceId ?? UniqueIdGenerator.snowflake()
    },
    startedAt: DateTime.current,
    startedBy: "System"
  };
  injector.bindConstant(SYSTEM_TOKEN, system);

  const newContext = {
    isInitialized: true,
    injector,
    system,
    env,
    utils,
    bindings,
    services: {}
  } as TGlobalContext;

  utils.logger.debug("Context Value: \n", newContext);

  return setGlobalContext<TGlobalContext>(newContext);
};

let GLOBAL_CONTEXT!: GlobalContext;
export const getGlobalContext = <
  TGlobalContext extends GlobalContext = GlobalContext
>(): TGlobalContext => {
  if (!GLOBAL_CONTEXT) {
    GLOBAL_CONTEXT = createGlobalContextProxy<TGlobalContext>({
      isInitialized: false
    } as TGlobalContext);
  }

  return GLOBAL_CONTEXT as TGlobalContext;
};

/**
 * Set the contents of the global context object.
 *
 * This completely replaces the existing context values such as currentUser.
 *
 * If you wish to extend the context simply use the `context` object directly,
 * such as `context.magicNumber = 1`, or `setContext({ ...context, magicNumber: 1 })`
 */
export const setGlobalContext = <
  TGlobalContext extends GlobalContext = GlobalContext
>(
  newContext: TGlobalContext
): TGlobalContext => {
  // re-init the proxy against the new context object,
  // so things like `console.log(context)` is the actual object,
  // not one initialized earlier.
  GLOBAL_CONTEXT = createGlobalContextProxy<TGlobalContext>(newContext);

  // Replace the value of context stored in the current async store
  const store = getGlobalContextStore().getStore();
  store?.set("context", newContext);

  return GLOBAL_CONTEXT as TGlobalContext;
};
