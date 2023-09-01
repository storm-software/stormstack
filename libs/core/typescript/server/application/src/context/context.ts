/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { EnvManager } from "@open-system/core-shared-env";
import { Injector } from "@open-system/core-shared-injection";
import { Injector as InjectorInterface } from "@open-system/core-shared-injection/types";
import { Logger, UniqueIdGenerator } from "@open-system/core-shared-utilities";
import { BaseServerContext, ServerContext, UserContext } from "../types";

export const createContext = <TUser extends UserContext = UserContext>({
  correlationId,
  logger,
  env,
  user,
  injector
}: {
  correlationId?: string;
  logger?: Logger;
  user?: TUser;
  env: EnvManager;
  injector: InjectorInterface;
}): ServerContext<TUser> => {
  const _injector = injector ?? Injector;

  return {
    correlationId: correlationId ? correlationId : UniqueIdGenerator.generate(),
    logger: logger ?? _injector.get(Logger),
    env,
    injector: _injector,
    user: { id: UniqueIdGenerator.generate(), ...user } as TUser
  };
};

export const extractCorrelationId = (context?: BaseServerContext) =>
  context?.correlationId;

export const extractLogger = (context?: BaseServerContext) => context?.logger;

export const extractUser = (context?: BaseServerContext) => context?.user;

export const extractUserId = (context?: BaseServerContext) => context?.user?.id;
