/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OnContextBuildingEventPayload, Plugin } from "@envelop/types";
import {
  GlobalServerContext,
  HttpRequest,
  UserContext,
  clearExecutionContext,
  extendServerContext,
  setGlobalServerContext
} from "@open-system/core-server-application";
import {
  GraphQLExecutionServerContext,
  GraphQLServerContext
} from "../context/context";

export type ExtendContextOptions = {
  shouldBindLoggerToInjector?: boolean;
  shouldBindEnvManagerToInjector?: boolean;
};

export const useExtendGraphQLServerContext = <
  TGlobalContext extends GlobalServerContext = GlobalServerContext,
  TExecutionContext extends GraphQLExecutionServerContext = GraphQLExecutionServerContext,
  TBindings = any
>(
  initialContext: TGlobalContext,
  options: ExtendContextOptions = {
    shouldBindLoggerToInjector: true,
    shouldBindEnvManagerToInjector: true
  }
): Plugin<
  GraphQLServerContext<TGlobalContext, TExecutionContext, TBindings>
> => {
  return {
    /*async onPluginInit() {
      if (
        options?.shouldBindLoggerToInjector &&
        !initialContext.injector.isBound(Logger)
      ) {
        bindService(Logger, ConsoleLogger, initialContext.injector);
      }

      if (
        options?.shouldBindEnvManagerToInjector &&
        !initialContext.injector.isBound(EnvManager)
      ) {
        bindService(EnvManager, EnvManager, initialContext.injector);
      }
    },*/
    async onContextBuilding({
      context,
      extendContext
    }: OnContextBuildingEventPayload<
      GraphQLServerContext<TGlobalContext, TExecutionContext, TBindings>
    >) {
      const extended = (await extendServerContext<
        HttpRequest,
        UserContext<any>,
        GlobalServerContext,
        TExecutionContext,
        TBindings
      >({
        initialContext: clearExecutionContext(initialContext) as TGlobalContext,
        request: context.execution.request,
        user: {
          id: "423424223211",
          name: "Pat Sullivan",
          email: "john.johnson@email.com"
        },
        bindings: context?.bindings
      })) as GraphQLServerContext<TGlobalContext, TExecutionContext, TBindings>;

      extended.execution.operationName =
        context.params.operationName ?? "unknown";
      extended.execution.request.body = context.params;

      extendContext(setGlobalServerContext(extended));
    }
  };
};
