/* eslint-disable @typescript-eslint/no-explicit-any */
import type { OnContextBuildingEventPayload, Plugin } from "@envelop/types";
import {
  ExtendServerContextFn,
  GlobalContext,
  extendServerContext
} from "@open-system/core-server-application";
import {
  GraphQLExecutionContext,
  GraphQLServerContext,
  extendGraphQLServerContext
} from "../context/context";

export type ExtendContextOptions<
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TServerContext extends GraphQLServerContext<
    TGlobalContext,
    TExecutionContext
  > = GraphQLServerContext<TGlobalContext, TExecutionContext>
> = {
  shouldBindLoggerToInjector?: boolean;
  shouldBindEnvManagerToInjector?: boolean;
  plugin?:
    | ExtendServerContextFn<TGlobalContext, TExecutionContext, TServerContext>
    | ExtendServerContextFn<
        TGlobalContext,
        TExecutionContext,
        TServerContext
      >[];
};

export const useExtendGraphQLServerContext = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext,
  TServerContext extends GraphQLServerContext<
    TGlobalContext,
    TExecutionContext
  > = GraphQLServerContext<TGlobalContext, TExecutionContext>
>(
  globalContext: TGlobalContext,
  options: ExtendContextOptions<
    TGlobalContext,
    TExecutionContext,
    TServerContext
  > = {
    shouldBindLoggerToInjector: true,
    shouldBindEnvManagerToInjector: true
  }
): Plugin<TServerContext> => {
  return {
    async onContextBuilding({
      context,
      extendContext
    }: OnContextBuildingEventPayload<TServerContext>) {
      let serverContext!: TServerContext;
      if (options.plugin) {
        serverContext = await extendServerContext<
          TGlobalContext,
          TExecutionContext,
          TServerContext
        >(
          globalContext,
          context.execution,
          (Array.isArray(options.plugin)
            ? [extendGraphQLServerContext, ...options.plugin]
            : [
                extendGraphQLServerContext,
                options.plugin
              ]) as ExtendServerContextFn<
            TGlobalContext,
            TExecutionContext,
            TServerContext
          >[]
        );
      } else {
        serverContext = await extendServerContext<
          TGlobalContext,
          TExecutionContext,
          TServerContext
        >(
          globalContext,
          context.execution,
          extendGraphQLServerContext as unknown as ExtendServerContextFn<
            TGlobalContext,
            TExecutionContext,
            TServerContext
          >
        );
      }

      extendContext(serverContext);
    }
  };
};
