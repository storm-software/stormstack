/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLogger as useLoggerExt } from "@envelop/core";
import { Plugin } from "@envelop/types";
import { GlobalContext } from "@open-system/core-server-application/context/global-context";
import {
  GraphQLExecutionContext,
  GraphQLServerContext
} from "../context/context";

export type LoggerPluginOptions = {
  logFn?: typeof console.log;
  skipIntrospection?: boolean;
};

export const useLogger = <
  TGlobalContext extends GlobalContext = GlobalContext,
  TExecutionContext extends GraphQLExecutionContext = GraphQLExecutionContext
>(
  globalContext: TGlobalContext,
  options?: LoggerPluginOptions
): Plugin<GraphQLServerContext<TGlobalContext, TExecutionContext>> => {
  return useLoggerExt({
    logFn: async (eventName, args) => {
      const context =
        (args.contextValue as GraphQLServerContext<
          TGlobalContext,
          TExecutionContext
        >) ?? globalContext;

      const logger = context.utils.logger;
      logger.info(`Event triggered: ${eventName}`);

      logger.debug(context.utils.parser.stringify(args));
    },
    skipIntrospection: options?.skipIntrospection ?? true
  }) as Plugin<GraphQLServerContext<TGlobalContext, TExecutionContext>>;
};
