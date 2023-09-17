/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OnContextBuildingEventPayload, Plugin } from "@envelop/types";
import {
  HttpRequest,
  InitialServerContext,
  UserContext,
  extendServerContext
} from "@open-system/core-server-application";
import { InfisicalEnvManager } from "@open-system/core-server-infisical";
import { PinoLogger } from "@open-system/core-server-pino-logging";
import { EnvManager } from "@open-system/core-shared-env/env-manager";
import { Logger } from "@open-system/core-shared-logging/logger";
import {
  GraphQLActiveServerContext,
  GraphQLServerContext
} from "../context/context";

export type ExtendContextOptions = {
  shouldBindLoggerToInjector?: boolean;
  shouldBindEnvManagerToInjector?: boolean;
};

export const useExtendGraphQLServerContext = <
  TInitialContext extends InitialServerContext = InitialServerContext,
  TActiveContext extends GraphQLActiveServerContext = GraphQLActiveServerContext,
  TBindings = any
>(
  initialContext: TInitialContext,
  options: ExtendContextOptions = {
    shouldBindLoggerToInjector: true,
    shouldBindEnvManagerToInjector: true
  }
): Plugin<GraphQLServerContext<TInitialContext, TActiveContext, TBindings>> => {
  return {
    async onPluginInit() {
      if (options?.shouldBindLoggerToInjector) {
        initialContext.injector.isBound(Logger)
          ? initialContext.injector
              .rebind(Logger)
              .to(PinoLogger)
              .inSingletonScope()
          : initialContext.injector
              .bind(Logger)
              .to(PinoLogger)
              .inSingletonScope();
      }

      if (options?.shouldBindEnvManagerToInjector) {
        initialContext.injector.isBound(EnvManager)
          ? initialContext.injector
              .rebind(EnvManager)
              .to(InfisicalEnvManager)
              .inSingletonScope()
          : initialContext.injector
              .bind(EnvManager)
              .to(InfisicalEnvManager)
              .inSingletonScope();
      }
    },
    async onContextBuilding({
      context,
      extendContext
    }: OnContextBuildingEventPayload<
      GraphQLServerContext<TInitialContext, TActiveContext, TBindings>
    >) {
      const extended = (await extendServerContext<
        HttpRequest,
        UserContext<any>,
        InitialServerContext,
        TActiveContext,
        TBindings
      >({
        initialContext: initialContext as TInitialContext,
        request: context.active.request,
        user: {
          id: "423424223211",
          name: "Pat Sullivan",
          email: "john.johnson@email.com"
        },
        bindings: context?.bindings
      })) as GraphQLServerContext<TInitialContext, TActiveContext, TBindings>;

      extended.active.operationName = context.params.operationName ?? "unknown";
      extended.active.request.body = context.params;

      extendContext({
        ...initialContext,
        ...extended
      });
    }
  };
};
